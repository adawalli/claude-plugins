---
name: code-review
description: "Run a local multi-agent code review before pushing or creating a PR. Use this skill whenever the user says 'code-review', 'pre-review', 'review my changes', 'review before push', 'check my branch', 'local review', 'pre-PR review', or wants feedback on their current branch changes before submitting a pull request. Also use when the user asks to 'review the diff', 'check for issues before PR', or mentions wanting to catch review feedback early. This skill spawns multiple specialized review agents in parallel to give comprehensive feedback fast."
---

# Code Review: Local Multi-Agent Code Review

Run a comprehensive code review locally before pushing, catching the same kinds of issues that would surface in PR review - but without the round-trip.

Parallel independent agents, confidence-based filtering, and a validation pass to eliminate false positives.

## Execution Steps

Follow these steps precisely. Create a todo list before starting.

### Step 1: Gather context

Run these in parallel:

```bash
git fetch origin
```

```bash
git diff origin/main...HEAD
```

```bash
git diff --name-only origin/main...HEAD
```

```bash
git diff HEAD  # uncommitted changes
```

Also read the project's CLAUDE.md (root and any CLAUDE.md files in directories containing changed files).

If there are no changes relative to origin/main AND no uncommitted changes, tell the user and stop.

If the diff is very large (50+ files), mention this and ask whether to scope to specific directories.

### Step 2: Identify relevant specs and plans (optional)

Check if the project has a `docs/specs/` directory. If so, match changed file paths to relevant spec files (e.g. changes to `src/app/events/` likely relate to an events spec). Read any matching specs for the architecture reviewer.

Also check for recent plan files that may have iterated on the spec during implementation. Plans often document intentional deviations from the original spec (renamed fields, adjusted behavior, deferred features). Look for:
- `.claude/plans/` or similar plan directories
- Plan files referenced in recent conversation context
- Any `PLAN.md` or `plan-*.md` files in the project root or docs

If a plan documents an intentional spec deviation, pass that context to the architecture reviewer so it doesn't flag decisions that were already made deliberately.

Best-effort - skip if no specs or plans exist or none match.

### Step 3: Spawn review agents

Launch all four agents in parallel using the Agent tool with `model: sonnet`. Each agent receives:
- The full combined diff (committed + uncommitted)
- The list of changed files
- The project's CLAUDE.md contents
- The branch name and a brief summary of what the changes appear to do

The four review agents are registered at the plugin level:

1. **`review-code-quality`** - CLAUDE.md compliance, patterns, conventions, DRY, clarity
2. **`review-testing`** - Test coverage gaps, test quality, missing edge cases
3. **`review-security`** - Injection, validation, auth, data exposure
4. **`review-architecture`** - Project patterns, spec alignment, schema consistency (include spec content if found in step 2)

Each agent has tools: Read, Grep, Glob, Bash (for git commands only). They can and should inspect actual source files for context beyond the diff.

Each agent returns a structured list of issues. An issue has:
- `file`: file path
- `line`: line number (approximate is fine)
- `severity`: "critical" | "important" | "suggestion"
- `confidence`: 0-100
- `description`: what's wrong
- `fix`: concrete suggestion
- `source`: which agent found it

Agents only return issues with confidence >= 80.

### Step 4: Validate flagged issues

This step is critical for reducing false positives.

For each issue returned by the review agents, spawn a validation agent (sonnet for CLAUDE.md/style issues, opus for bugs/logic). The validator receives:
- The specific issue description
- The relevant source file content
- The diff context
- The project's CLAUDE.md

The validator's job: confirm or reject the issue. An issue is rejected if:
- It's a pre-existing problem not introduced in this diff
- It looks like a bug but is actually correct given the broader context
- It's a pedantic nitpick a senior engineer would not flag
- It's something a linter would catch (don't flag what tooling handles)
- It's a general quality concern not explicitly required in CLAUDE.md
- The code has an explicit lint-ignore or similar suppression
- The evidence is superficial (correct filename but wrong content, etc.)

To keep this fast, batch validation: if there are <= 6 issues, validate them all in parallel. If more than 6, group related issues (same file or same type) and validate each group together.

Drop any issue the validator rejects.

### Step 5: Report findings

Output the final report to the terminal:

```
## Code Review Results

**Summary:** X critical, Y important, Z suggestions across N files
**Verdict:** [READY / ALMOST / NOT YET]

### Critical
- **src/db/schema.ts:42** [architecture] Missing NOT NULL constraint on user_id
  Fix: Add `.notNull()` to the column definition

### Important
- **src/app/api/route.ts:15** [security] Unvalidated user input passed to query
  Fix: Add Zod validation before using `params.id`

### Suggestions
- **src/components/Card.tsx:88** [code-quality] Duplicated padding logic (also in Header.tsx:12)
  Fix: Extract to a shared utility or Tailwind @apply

### What looked good
- Test coverage for the new event handlers
- Clean separation of server actions from UI components
```

Verdict logic:
- **READY**: No critical or important issues
- **ALMOST**: No critical issues, but has important ones
- **NOT YET**: Has critical issues

If no issues survived validation: "No issues found. Checked for bugs, CLAUDE.md compliance, testing, security, and architecture."
