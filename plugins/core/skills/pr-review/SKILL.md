---
name: pr-review
description: "Address PR review feedback autonomously in a monitor-fix-push loop until automated reviewers approve or have no blockers. Supports Claude reviews (`claude[bot]`) and Codex reviews (`chatgpt-codex-connector`, `chatgpt-codex-connector[bot]`), including Codex inline P1/P2/P3 comments. Default mode (`--non-interactive`) polls or background-watches for new feedback, triages it, fixes valid issues, replies, commits, pushes, and loops. In Codex, use a cheap read-only background watcher agent when the user asks to wait, watch, loop, background, or wake them when feedback lands and no Monitor tool exists. Pass `--interactive` for a human-confirmed single pass. Use whenever the user says 'pr-review', 'pr-feedback', 'handle PR comments', 'fix PR review', 'respond to PR', 'address Codex comments', 'handle Claude review', 'run the PR loop', 'watch for PR feedback', 'background PR review', or asks to check reviewer feedback."
---

# PR Feedback: Monitor, Triage, Fix, Respond

Process review feedback on the current PR in a closed loop: wait for the next automated review, triage every actionable comment, implement valid fixes, push back on invalid suggestions, reply on-thread, commit, push, and go back to waiting. Default behavior is autonomous; pass `--interactive` to check in with the user at each triage.

The monitoring mechanism is host-dependent. Claude Code may have a Monitor tool. Codex usually does not, so prefer a cheap read-only background watcher agent when the user wants the prompt to wake up after feedback lands.

This skill supports both:

- **Claude**: `claude[bot]` top-level issue comments with severity sections (`### Critical`, `### High`, etc.).
- **Codex**: `chatgpt-codex-connector` formal review summaries plus actionable inline comments from `chatgpt-codex-connector[bot]`, usually with P1/P2/P3 badges.

## Modes

Parse the argument string for mode flags:

- **`--non-interactive`** (default): run the monitor -> triage -> fix -> respond -> push -> monitor loop autonomously. Decide fix-vs-pushback using Step 3 and loop until the exit criteria in Step 7 are met.
- **`--interactive`**: run one pass only. Present the triage table and wait for confirmation before making changes and before pushing.
- **`--reviewer claude|codex|all`**: optionally scope the loop. If omitted, use `all` unless the user named one reviewer in the request.
- **`--background-watch`**: use a read-only background watcher agent for wait-only monitor phases when the host supports background agents. Treat user phrases like "background this", "watch for feedback", "wake me when it lands", or "loop until review" as this mode.
- **`--foreground-watch`**: keep polling in the current session when background agents are unavailable or the user wants all activity visible inline.

If both interactive and non-interactive flags appear, prefer `--interactive`. If the user's message says "one pass", "just this round", or "let me review the triage", treat it as interactive.

## Common Setup

Before doing anything else:

1. Identify the PR from the current branch:

   ```bash
   gh pr view --json number,url,title,headRefName,state,isDraft
   gh repo view --json owner,name --jq '{owner:.owner.login, repo:.name}'
   ```

   Record `{owner}`, `{repo}`, `{number}`, and the PR URL.

2. Record baselines so new feedback can be detected after each push. Track both IDs and timestamps because some bots update an existing comment instead of creating a new one:

   ```bash
   git rev-parse HEAD
   gh api repos/{owner}/{repo}/issues/{number}/comments --paginate \
     --jq '([.[] | select(.user.login == "claude[bot]")] | last // {}) | {id:(.id // 0), updated_at:(.updated_at // "")}'
   gh api repos/{owner}/{repo}/pulls/{number}/reviews --paginate \
     --jq '([.[] | select(.user.login == "claude[bot]" or .user.login == "chatgpt-codex-connector")] | last // {}) | {id:(.id // 0), user:.user.login, submitted_at:(.submitted_at // ""), state}'
   gh api repos/{owner}/{repo}/pulls/{number}/comments --paginate \
     --jq '([.[] | select(.user.login == "chatgpt-codex-connector[bot]")] | last // {}) | {id:(.id // 0), updated_at:(.updated_at // "")}'
   ```

3. Create a short todo list for the cycle so progress is visible.

If `isDraft == true`, confirm with the user before looping. Automated reviews on drafts are often low-signal.

## Non-Interactive Loop

Each iteration is: **monitor -> fetch -> triage -> fix -> follow-up -> respond -> commit -> push -> monitor**. Stop after 8 iterations as a safety cap.

### Step 1 - Monitor for New Review Feedback

Wait until selected reviewer feedback lands that is newer than the baseline. Track issue comments, formal review objects, and inline review comments separately because their IDs live in different namespaces.

Choose the monitor backend in this order:

1. **Feedback already exists**: if a fetch shows new actionable feedback newer than the baseline, skip waiting and continue to Step 2.
2. **Claude Code Monitor tool**: use it when available.
3. **Codex background watcher**: when background agents are available and the user asked to wait, watch, loop, background, or wake them, start a read-only watcher agent using the prompt below.
4. **Foreground shell poll**: use the bounded shell poll below when no background mechanism is available.

Do not let a watcher agent edit files, reply to GitHub, commit, push, or triage. Its only job is to cheaply poll and return a wake-up signal.

#### Codex Background Watcher

Start one lightweight background watcher for each wait-only monitor phase. Give it only the PR coordinates, reviewer scope, baselines, and timeout. The parent agent keeps ownership of triage, code changes, replies, commits, and pushes.

Watcher prompt:

```text
You are a read-only PR review watcher.

Repo: {owner}/{repo}
PR: #{number}
Reviewer scope: {claude|codex|all}
Baselines:
- HEAD: {head_sha}
- Claude issue comment: id={id}, updated_at={updated_at}
- Review object: id={id}, submitted_at={submitted_at}
- Codex inline comment: id={id}, updated_at={updated_at}

Poll GitHub every 60 seconds for up to 30 minutes. Detect only reviewer feedback newer than the baselines:
- claude[bot] issue comments
- claude[bot] or chatgpt-codex-connector formal PR reviews
- chatgpt-codex-connector[bot] inline review comments

Do not edit files, reply, commit, push, trigger reviews, or triage. When new feedback appears, stop immediately and return:
NEW_FEEDBACK reviewer=<name> source=<issue_comment|review|inline_comment> id=<id> updated_at=<timestamp> url=<url if available>

If no feedback appears before timeout, return:
TIMEOUT waited_minutes=30
```

When the watcher completes with `NEW_FEEDBACK`, continue to Step 2 in the parent session. When it returns `TIMEOUT`, surface the timeout and ask whether to re-arm, trigger a reviewer, or stop.

#### Foreground Shell Poll

```bash
baseline_claude_issue_comment_id={LAST_SEEN_CLAUDE_ISSUE_COMMENT_ID_OR_0}
baseline_claude_issue_comment_updated_at="{LAST_SEEN_CLAUDE_ISSUE_COMMENT_UPDATED_AT_OR_EMPTY}"
baseline_review_id={LAST_SEEN_REVIEW_ID_OR_0}
baseline_review_submitted_at="{LAST_SEEN_REVIEW_SUBMITTED_AT_OR_EMPTY}"
baseline_codex_inline_comment_id={LAST_SEEN_CODEX_INLINE_COMMENT_ID_OR_0}
baseline_codex_inline_comment_updated_at="{LAST_SEEN_CODEX_INLINE_COMMENT_UPDATED_AT_OR_EMPTY}"
deadline=$((SECONDS + 1800))

while [ "$SECONDS" -lt "$deadline" ]; do
  latest_claude_comment=$(gh api repos/{owner}/{repo}/issues/{number}/comments --paginate \
    --jq '([.[] | select(.user.login == "claude[bot]")] | last // {}) | {id:(.id // 0), updated_at:(.updated_at // "")}' 2>/dev/null || echo '{"id":0,"updated_at":""}')
  latest_review=$(gh api repos/{owner}/{repo}/pulls/{number}/reviews --paginate \
    --jq '([.[] | select(.user.login == "claude[bot]" or .user.login == "chatgpt-codex-connector")] | last // {}) | {id:(.id // 0), submitted_at:(.submitted_at // "")}' 2>/dev/null || echo '{"id":0,"submitted_at":""}')
  latest_codex_inline=$(gh api repos/{owner}/{repo}/pulls/{number}/comments --paginate \
    --jq '([.[] | select(.user.login == "chatgpt-codex-connector[bot]")] | last // {}) | {id:(.id // 0), updated_at:(.updated_at // "")}' 2>/dev/null || echo '{"id":0,"updated_at":""}')

  latest_claude_comment_id=$(printf '%s' "$latest_claude_comment" | jq -r '.id // 0')
  latest_claude_comment_updated_at=$(printf '%s' "$latest_claude_comment" | jq -r '.updated_at // ""')
  latest_review_id=$(printf '%s' "$latest_review" | jq -r '.id // 0')
  latest_review_submitted_at=$(printf '%s' "$latest_review" | jq -r '.submitted_at // ""')
  latest_codex_inline_id=$(printf '%s' "$latest_codex_inline" | jq -r '.id // 0')
  latest_codex_inline_updated_at=$(printf '%s' "$latest_codex_inline" | jq -r '.updated_at // ""')

  if [ "$latest_claude_comment_id" -gt "$baseline_claude_issue_comment_id" ] || [ "$latest_claude_comment_updated_at" \> "$baseline_claude_issue_comment_updated_at" ]; then
    echo "NEW_CLAUDE_COMMENT id=$latest_claude_comment_id updated_at=$latest_claude_comment_updated_at"
    exit 0
  fi
  if [ "$latest_review_id" -gt "$baseline_review_id" ] || [ "$latest_review_submitted_at" \> "$baseline_review_submitted_at" ]; then
    echo "NEW_REVIEW id=$latest_review_id submitted_at=$latest_review_submitted_at"
    exit 0
  fi
  if [ "$latest_codex_inline_id" -gt "$baseline_codex_inline_comment_id" ] || [ "$latest_codex_inline_updated_at" \> "$baseline_codex_inline_comment_updated_at" ]; then
    echo "NEW_CODEX_INLINE id=$latest_codex_inline_id updated_at=$latest_codex_inline_updated_at"
    exit 0
  fi
  sleep 30
done

echo "TIMEOUT waited_minutes=30"
exit 2
```

Use a 30 minute timeout per wait. If it times out, surface that to the user rather than silently re-arming.

If this is the first run and the selected reviewer has never reviewed the PR, ask before triggering a review. Common triggers are `@claude please review` for Claude and `@codex review` for Codex.

### Step 2 - Fetch Review Feedback

Fetch all relevant feedback using filtered API calls. Raw API responses get large and can hide important comments behind truncation.

**Inline code comments**:

```bash
gh api repos/{owner}/{repo}/pulls/{number}/comments --paginate \
  --jq '.[] | {id, author: .user.login, path, line: .line, original_line: .original_line, in_reply_to: .in_reply_to_id, body}'
```

**Review objects**:

```bash
gh api repos/{owner}/{repo}/pulls/{number}/reviews --paginate \
  --jq '.[] | {id, author: .user.login, state, body, submitted_at, commit_id}'
```

**Top-level PR comments**:

```bash
gh api repos/{owner}/{repo}/issues/{number}/comments --paginate \
  --jq '.[] | {id, author: .user.login, body, created_at, updated_at}'
```

If a body is truncated, fetch it directly:

```bash
gh api repos/{owner}/{repo}/issues/comments/{comment_id} --jq '.body'
gh api repos/{owner}/{repo}/pulls/comments/{comment_id} --jq '.body'
```

Parse feedback by reviewer:

- **Claude issue comments**: treat each numbered item under `### Critical`, `### High`, `### Medium`, `### Low`, `### Minor`, `### Nits`, or `### Questions` as a triage row. Carry the severity label forward. Ignore Claude "encountered an error" comments unless the user asked to diagnose reviewer failures.
- **Claude inline comments**: treat each top-level inline comment as one triage row.
- **Codex inline comments**: treat each top-level inline comment from `chatgpt-codex-connector[bot]` as one triage row. Extract priority from badge text (`P1`, `P2`, `P3`) when present. Ignore the `Useful? React with...` footer.
- **Codex review object**: use it as a review marker and commit marker. It may only contain the "Codex Review" header and reviewed commit, while actionable suggestions live in inline comments.
- **Human comments**: include only if the user asked to address all reviewers. Otherwise call them out in the final summary.

Skip replies (`in_reply_to != null`) during triage unless they contain a new unresolved request.

### Step 3 - Read Code and Triage

For each triage row, read enough surrounding source to judge it. Check specs, tests, docs, and project instructions before deciding. Do not rely only on the diff line.

Classify each row as:

- **Fix** - genuine bug, missed edge case, convention violation, missing test, or real readability win.
- **Pushback** - reviewer misread the code, suggestion contradicts a spec or deliberate design, or the change would add complexity without a concrete benefit.
- **Question** - ambiguous feedback or missing context.
- **Acknowledge** - informational, positive, duplicate, already addressed, or reviewer error noise.

Autonomy guardrail: when a comment is near the fix/pushback line, lean toward fixing. Pushback needs a concrete technical reason that can stand on its own in the PR thread.

For Codex priorities, treat `P1` like Critical/High, `P2` like Medium/High depending on impact, and `P3` like Low/Minor. Do not blindly fix a Codex suggestion just because it is priority-labeled; still verify it against the code.

### Step 4 - Implement Fixes and Follow-Ups

Make all code changes for rows triaged as Fix. For each cluster of related fixes:

1. Edit the smallest coherent surface.
2. Add or update focused tests when the feedback is behavioral.
3. Run the smallest relevant test command.

Then decide whether to invoke follow-up skills:

- Use `/simplify` when the fixes introduced duplication, long functions, nested branching, or one-off helpers.
- Use `/core:code-review` when fixes touched auth, migrations, financial calculations, event emission, adapter boundaries, or non-trivial shared services.

Run the full relevant test suite once before replying/pushing. Never push a known red commit.

### Step 5 - Reply to Review Threads

Reply to every triaged actionable item before pushing, so replies land before the push triggers the next review pass.

Use direct, technical replies:

- **Fix**: "Fixed - added a null guard before loading reconciliation state. Incoming commit."
- **Pushback**: "Keeping this as-is. The server action already revalidates the route after mutation, and the stale state described here cannot persist past the next render."
- **Question**: ask the specific clarifying question and state your current understanding.
- **Acknowledge**: brief confirmation.

Post replies with:

```bash
# Reply to an inline review comment thread
gh api repos/{owner}/{repo}/pulls/{number}/comments \
  -f body="Your reply here" \
  -F in_reply_to={comment_id}

# Reply to a top-level issue comment
gh api repos/{owner}/{repo}/issues/{number}/comments \
  -f body="Your reply here"
```

For Codex inline comments, reply directly to the inline comment. Do not ask Codex to "address that feedback" unless the user explicitly wants Codex cloud to make the changes.

Avoid tagging `@claude` or `@codex` in routine replies; pushing should trigger the next review in repos configured for automated review. Tag only when the repo requires manual triggering or the user asks.

### Step 6 - Commit and Push

Use the `git-commit` skill to create a conventional commit. Reference the PR and reviewer round, for example:

```text
fix: address PR #16 Codex review feedback
```

Push in non-interactive mode without asking. Do not use `--no-verify`; if hooks fail, fix the root cause and re-commit.

After pushing, update baselines: HEAD SHA, latest Claude issue comment ID/timestamp, latest review object ID/timestamp, and latest Codex inline comment ID/timestamp. Then return to Step 1.

### Step 7 - Exit Criteria

Stop when any of these are true:

- The selected reviewer has no new actionable Critical/High/P1/P2 items left to fix.
- Claude's latest review body says "ready to merge", "no remaining blockers", "LGTM", or similar, and lists no new Critical/High items.
- Codex has no top-level inline comments newer than the last processed commit, or the remaining Codex comments have already been fixed, pushed back with technical reasoning, or acknowledged as non-actionable.
- A formal review object with `state == "APPROVED"` lands.
- You hit 8 iterations.
- Tests fail in a way you cannot resolve without broader context, or the fix requires a decision outside PR scope.

Do not loop just to re-argue pushback items. If the same concern returns and your technical reply is still valid, count it as resolved-by-pushback and evaluate the remaining items.

### Step 8 - Final Summary

Print a concise summary:

```text
## PR Feedback Loop Complete

Reviewers handled: Codex, Claude
Iterations: 2
Total fixes: 4 items across 2 commits (abc1234, def5678)
Pushbacks: 1 item (defended on-thread)
Follow-ups invoked: /core:code-review (round 1)
Final state: no remaining P1/P2 or Critical/High blockers
PR: https://github.com/owner/repo/pull/16
```

If you stopped due to a cap or blocker, say so and name the stuck item.

## Interactive Mode

Interactive mode runs one pass:

1. Run Common Setup.
2. Fetch feedback.
3. Read code and produce a triage table:

   ```text
   ## PR Feedback Triage

   ### Will Fix (3)
   - app/layout.tsx:19 (@chatgpt-codex-connector[bot], P1) - Avoid loading DB reconciliation from the root layout
     Reason: Import-time DB client initialization can break optional DATABASE_URL mode.

   ### Will Push Back (1)
   - components/example.tsx:22 (@claude[bot], Medium) - "Use useCallback here"
     Reason: Component renders once per page load; memoization adds indirection without a measurable benefit.

   ### Need Clarification (0)
   ### Acknowledge (1)
   ```

4. Wait for user confirmation.
5. Implement fixes and run tests.
6. Reply to threads.
7. Commit, then ask before pushing.
8. Print the final summary for the single pass.

## Notes

- Bot identities differ by endpoint. `gh pr view --json reviews` may show Codex as `chatgpt-codex-connector`; inline review comments use `chatgpt-codex-connector[bot]`.
- Codex's formal review body can be mostly boilerplate. The actionable content is often in inline comments, not the review body.
- Claude usually posts full reviews as top-level issue comments, not formal review objects.
- Use `--jq` filters for `gh api`; raw responses are large enough to hide relevant feedback.
- If human reviewers have unresolved comments and the loop was scoped to bots, mention them in the final summary.
- Never skip hooks with `--no-verify`.
