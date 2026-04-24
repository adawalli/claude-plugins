---
name: pr-review
description: "Address PR review feedback autonomously in a monitor-fix-push loop until the Claude reviewer approves. Default mode (`--non-interactive`) polls the PR for new Claude reviews, triages feedback on its own, runs `/simplify` or `/core:code-review` when warranted, responds to threads, commits, pushes, and loops until Claude approves. Pass `--interactive` to fall back to the older human-in-the-loop triage flow. Use this skill whenever the user says 'pr-review', 'pr-feedback', 'address PR feedback', 'handle PR comments', 'fix PR review', 'respond to PR', 'address review comments', 'work the PR until Claude approves', 'run the PR loop', or wants to process review feedback on a GitHub PR. Also trigger when the user says 'check what reviewers said', 'look at PR comments', or references review feedback they received."
---

# PR Feedback: Monitor, Triage, Fix, Respond — On Loop

Process review feedback on the current PR in a closed loop: wait for Claude's next review, triage every comment, implement the fixes that matter, push back on the ones that don't, reply on-thread, commit, push, and go back to waiting. Default behavior is fully autonomous; pass `--interactive` to check in with the user at each triage.

## Why this workflow matters

PR review cycles are slow when done by hand: read comments, context-switch into code, fix, push, wait, come back, reply to each thread, wait again. This skill collapses that into one continuous pass — the agent holds the loop, makes triage decisions, reasons through complexity-sensitive follow-ups (simplification, second-opinion review), and only exits once the Claude reviewer signs off. The human stays out of the tight loop but keeps steering power through pushback reasoning and optional interactive mode.

## Modes

Parse the argument string for mode flags:

- **`--non-interactive`** (default, assumed if no flag is passed): run the full monitor → triage → fix → respond → push → monitor loop autonomously. The agent decides fix-vs-pushback on its own using the criteria in Step 3, and decides whether to invoke `/simplify` and/or `/core:code-review` using the heuristics in Step 4. Exit only when Claude's latest review is effectively approving (see Exit Criteria in Step 7).
- **`--interactive`**: run a single pass of the flow (no monitor loop). Present the triage table to the user and wait for confirmation before making changes and before pushing. This is the old behavior, kept for when the user wants to steer each cycle by hand.

If both flags appear, prefer `--interactive`. If the user's message contains phrases like "one pass", "just this round", or "let me review the triage", treat it as `--interactive` even without the flag.

## Common setup (both modes)

Before doing anything else:

1. Identify the PR from the current branch:
   ```bash
   gh pr view --json number,url,title,headRefName,state,isDraft
   ```
   Record `{owner}`, `{repo}`, `{number}`, and the PR URL — you'll reuse them throughout.

2. Record a baseline so you can detect *new* Claude reviews later. Capture:
   - Latest head SHA: `git rev-parse HEAD`
   - The most recent `claude[bot]` comment ID and `updated_at`, if any:
     ```bash
     gh api repos/{owner}/{repo}/issues/{number}/comments --paginate \
       --jq '[.[] | select(.user.login == "claude[bot]")] | last | {id, updated_at}'
     ```
     Also check review objects:
     ```bash
     gh api repos/{owner}/{repo}/pulls/{number}/reviews --paginate \
       --jq '[.[] | select(.user.login == "claude[bot]")] | last | {id, submitted_at, state}'
     ```

Create a short todo list for the cycle you're about to run so progress is visible.

---

## Non-interactive loop (default)

Run the steps below as a loop. Each iteration is: **monitor → fetch → triage → fix → follow-up → respond → commit → push → back to monitor**. End when the Exit Criteria in Step 7 are satisfied, or after 8 iterations as a hard safety cap (if you hit the cap, stop and summarize — something is oscillating and the human should look).

### Step 1 — Monitor for a new Claude review

Wait until a Claude review lands that is *newer than the baseline* (higher ID than what you recorded on the last push, or — on the first iteration — any Claude review at all that was triggered by the current HEAD).

Use the **Monitor tool**, not a synchronous `for`/`sleep` loop. Monitor runs the poll script in the background and emits one notification the moment a new review appears, so the agent isn't blocked on `sleep` and cache warmth isn't burned on a spinning wait. Drive Monitor with a script like this:

```bash
# Track two baselines separately — issue-comment IDs and review IDs live in
# different numeric namespaces, so they can't be compared against each other.
baseline_comment_id={LAST_SEEN_CLAUDE_ISSUE_COMMENT_ID_OR_0}
baseline_review_id={LAST_SEEN_CLAUDE_REVIEW_ID_OR_0}

while true; do
  latest_comment=$(gh api repos/{owner}/{repo}/issues/{number}/comments --paginate \
    --jq '[.[] | select(.user.login == "claude[bot]")] | last | .id // 0' 2>/dev/null || echo 0)
  latest_review=$(gh api repos/{owner}/{repo}/pulls/{number}/reviews --paginate \
    --jq '[.[] | select(.user.login == "claude[bot]")] | last | .id // 0' 2>/dev/null || echo 0)
  if [ "$latest_comment" -gt "$baseline_comment_id" ]; then
    echo "NEW_COMMENT id=$latest_comment"
    exit 0
  fi
  if [ "$latest_review" -gt "$baseline_review_id" ]; then
    echo "NEW_REVIEW id=$latest_review"
    exit 0
  fi
  sleep 30
done
```

Invoke via the Monitor tool with:
- `description`: `"PR #{number}: awaiting new Claude review"` — appears in every notification, be specific.
- `command`: the script above with the baseline IDs substituted.
- `timeout_ms`: `1800000` (30 min) is a reasonable ceiling per wait. If the user wants to wait longer without babysitting, use `persistent: true` instead and cancel with TaskStop once you handle the event.
- Handle `|| echo 0` on each `gh api` call so a transient 5xx doesn't kill the monitor — a single failed poll should not take the whole watch down.

When Monitor emits the `NEW_COMMENT` / `NEW_REVIEW` line, proceed to Step 2. In practice on this user's workflow, Claude's reviews land as issue comments — the review-objects endpoint is usually empty. Track both anyway; it's cheap insurance against setup changes.

If Monitor times out without emitting an event, surface that to the user: "No new Claude review in 30 min — still waiting, or should I stop?" Don't re-arm silently; the human should decide whether this run is stalled.

On the first iteration only: if the PR has never had a Claude review and there is no pending `@claude` trigger in the thread, there is nothing to react to. Ask the user whether to request a review (and how — typically by pushing, or by posting a top-level `@claude please review` comment) rather than arming Monitor against silence.

### Step 2 — Fetch all review comments

When a new review lands, pull the full feedback set. Use `--jq` filters — raw API responses can be 30KB+ and get truncated, hiding real feedback behind bot noise.

**Inline code comments** (comments on specific diff lines):
```bash
gh api repos/{owner}/{repo}/pulls/{number}/comments --paginate \
  --jq '.[] | {id, author: .user.login, path, line: .original_line, in_reply_to: .in_reply_to_id, body}'
```

**Review objects** (approval / changes-requested with optional body):
```bash
gh api repos/{owner}/{repo}/pulls/{number}/reviews --paginate \
  --jq '.[] | {id, author: .user.login, state, body}'
```

**Issue comments** (top-level PR comments — where `claude[bot]` and `coderabbitai[bot]` post their reviews):
```bash
gh api repos/{owner}/{repo}/issues/{number}/comments --paginate \
  --jq '.[] | {id, author: .user.login, body}'
```

The issue comments endpoint is the important one for Claude — Claude posts its reviews as issue comments, not as formal `pulls/reviews`. If a body gets truncated, fetch it directly:

```bash
gh api repos/{owner}/{repo}/issues/comments/{comment_id} --jq '.body'
```

Parse each item out of Claude's review. Claude's GitHub reviews follow a predictable shape:

- Header line: `**Claude finished reviewing PR #N**`
- Severity-labeled sections: `### Critical`, `### High`, `### Medium`, `### Low`, and sometimes `### Nits` / `### Questions`
- Each numbered item inside a section has a title, a paragraph of context, file/line references (`src/lib/services/po-service.ts:1037-1061`), and often a `[Fix this →]` deep link (ignore those — they're for humans on claude.ai)

Treat every numbered item as its own triage row. Carry the severity label forward — it's what the exit criteria in Step 7 depend on.

### Step 3 — Read code and triage autonomously

For each comment, read enough surrounding source to judge it — not just the diff line. Check relevant specs in `specs/<NNN>-*/` or `docs/specs/`, related tests, and `CLAUDE.md` for conventions.

Then, without asking the user, classify each item as one of:

- **Fix** — genuine bug, missed edge case, convention violation, missing test, real readability win. If the comment identifies an actual behavior problem or contradicts project conventions, it's a fix.
- **Pushback** — the reviewer misread the code, the suggestion contradicts a spec or deliberate decision, it's over-engineering, or it's a style preference that isn't backed by project conventions. Pushback requires a concrete technical reason you can defend on-thread.
- **Question** — the comment is ambiguous or needs context you don't have. Reply asking the specific clarifying question; don't force a fix or pushback.
- **Acknowledge** — informational ("nice approach") or already addressed. Short reply.

**Autonomy guardrail:** when a comment is close to the fix / pushback line, lean toward fix. The human's leverage in this workflow is reading the final diff and reply, not steering triage — so err on the side of making the change and explaining your reasoning in the commit message. Pushback should feel like an argument you'd defend to the reviewer's face, not a shortcut.

Build an internal triage table (you'll log it in the summary at the end). In non-interactive mode, **do not block on user confirmation** — proceed to Step 4.

### Step 4 — Implement fixes and decide on follow-ups

Make all the code changes for items triaged as Fix. For each one: change the code, run the smallest relevant test that exercises it (`bun test <file>`), and move on.

Then decide whether to invoke follow-up skills. Use your own judgment — these are heuristics, not rules:

- **`/simplify`** — invoke when the fixes accumulated any of: duplicated logic across 2+ files you just touched, a function that grew past ~40 lines, nested conditionals you added to satisfy an edge case, or a new helper that feels one-off. Skip it for trivial one-liner fixes or purely mechanical renames.
- **`/core:code-review`** — invoke when the fixes touched: auth, migrations, financial calculations, event emission, adapter boundaries (QBO, OneDrive, DocuSign), or anything in `src/lib/services/` with non-trivial branching. Skip it for comment/docstring fixes, test-only changes, or UI polish.

You can invoke both, either, or neither. If you run `/simplify` or `/core:code-review` and they produce fixes of their own, fold those into the same commit as the reviewer-driven fixes — don't fragment the PR.

After all fixes and follow-ups are applied, run the full relevant test suite once to catch regressions:

```bash
bun test
```

If tests fail, fix them before moving on. Never push a red commit.

### Step 5 — Reply to threads (before pushing)

Reply to every triaged thread *before* pushing, so replies land before the push triggers the next Claude review pass.

For each item:
- **Fix** — short, specific confirmation. "Fixed — added null guard on `groupId` before the query. Incoming commit."
- **Pushback** — direct technical reasoning. Cite code, specs, or conventions. No hedging, no apologizing. "Keeping this as-is. The component renders once per page load (behind a layout boundary), so `useCallback` adds indirection without a perf benefit."
- **Question** — ask the specific clarifying question; include your current understanding so the reviewer can correct it efficiently.
- **Acknowledge** — brief thanks or a one-liner response.

Post replies with `gh api`:

```bash
# Reply to an inline review comment thread
gh api repos/{owner}/{repo}/pulls/{number}/comments \
  -f body="Your reply here" \
  -F in_reply_to={comment_id}

# Reply to a top-level issue comment
gh api repos/{owner}/{repo}/issues/{number}/comments \
  -f body="Your reply here"
```

**Do not tag `@claude` in replies.** The push in Step 6 triggers Claude to re-review automatically; tagging causes double reviews and muddies the loop's exit signal.

### Step 6 — Commit and push

Invoke the `/commit` skill (core:git-commit) to create a well-formatted commit. Reference the PR and the review iteration in the message, e.g.:

```
fix: address PR #12 review feedback (round 2)
```

Then push:

```bash
git push
```

In non-interactive mode, push without asking — that's the whole point of the mode. Do **not** use `--no-verify`; if a pre-commit hook fails, fix the root cause and re-commit.

After the push, update the baseline (new HEAD SHA, record the Claude comment ID you just processed as the new low-water mark) and return to Step 1.

### Step 7 — Exit criteria

Before looping, check whether you should stop instead:

Claude on this workflow almost never posts a formal `APPROVED` review object — reviews arrive as issue-comment bodies. Base exit on the body, not the `state` field.

Exit when **any** of these are true:

- The latest Claude review body contains no `### Critical` or `### High` sections, and the remaining items are all either (a) triaged as pushback with clean technical reasoning you've already posted on-thread, or (b) cosmetic (`### Nits`) items you explicitly chose not to address. In other words: nothing severity-Critical/High remains to fix.
- The review body uses explicit approval language — "ready to merge", "no remaining blockers", "LGTM", "looks good to merge" — and lists no new Critical/High items.
- A formal review object with `state == "APPROVED"` has landed (rare, but honor it if it does).
- You've hit 8 iterations. Stop and summarize what's oscillating. The human needs to look.
- Tests started failing in a way you can't resolve without broader context, or a fix requires a decision outside the PR's scope (e.g., schema migration, new dependency). Stop and ask.

Do **not** loop just to re-argue pushback items. If Claude keeps raising the same concern you've already defended on-thread with solid reasoning, count that concern as resolved-by-pushback and check the remaining items against the criteria above.

If none of the exit conditions apply, loop back to Step 1.

### Step 8 — Final summary

Once exited, print:

```
## PR Feedback Loop Complete

Iterations: 3
Total fixes: 7 items across 3 commits (abc1234, def5678, 9012abc)
Pushbacks: 2 items (defended on-thread)
Follow-ups invoked: /simplify (round 2), /core:code-review (round 1)
Final Claude review: APPROVED
PR: https://github.com/owner/repo/pull/12
```

If you exited due to the iteration cap or an unresolved blocker, say so explicitly and name the specific item that's stuck.

---

## Interactive mode (`--interactive`)

Runs **one pass** of the flow — no monitor loop, no autonomous push. Use when the user wants to steer.

1. Run the **Common setup** above.
2. Run **Step 2 (fetch feedback)**.
3. Run **Step 3 (read code and triage)** — but surface the triage table to the user and wait for confirmation before proceeding:

   ```
   ## PR Feedback Triage

   ### Will Fix (3)
   - **src/lib/actions/admin.ts:45** (@reviewer) — Missing null check on groupId
     Reason: Legitimate bug, would throw on undefined input
   - ...

   ### Will Push Back (1)
   - **src/components/admin/panel.tsx:22** (@reviewer) — "Should use useCallback here"
     Reason: Component renders once per page load, memoization adds complexity for no benefit

   ### Need Clarification (0)

   ### Acknowledge (1)
   - **General comment** (@reviewer) — "Good test coverage"
   ```

   Let the user override specific items before continuing.
4. Run **Step 4 (fixes + follow-ups)**. Ask the user before invoking `/simplify` or `/core:code-review` rather than deciding autonomously.
5. Run **Step 5 (reply to threads)**.
6. Run **Step 6 (commit)**, then ask "Ready to push?" and wait for confirmation before `git push`.
7. Print the Step 8 summary for this single pass.

Interactive mode never loops on its own. If the user wants another pass after Claude re-reviews, they'll re-invoke the skill.

---

## Notes and gotchas

- **Bot detection:** anything with a `[bot]` suffix in `user.login` is a bot. Claude is `claude[bot]`; CodeRabbit is `coderabbitai[bot]`. Don't reply to bots as if they were humans — keep replies technical and terse.
- **Truncation:** raw `gh api` responses truncate around 30KB. Always use `--jq` filters, and fetch individual long comment bodies separately when needed.
- **Drafts:** if `isDraft == true`, confirm with the user before looping — Claude reviews on drafts are often low-signal.
- **Conflicts between Claude and human reviewers:** the loop exits on *Claude's* approval. If a human reviewer has unresolved comments, call it out in the final summary; don't silently ignore them.
- **No `--no-verify`:** never skip hooks. If commit hooks fail, fix the root cause.
