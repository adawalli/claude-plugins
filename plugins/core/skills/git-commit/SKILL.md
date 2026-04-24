---
name: git-commit
description: "Create well-formatted git commits using conventional commit format. Use this skill when the user asks to 'commit', 'commit changes', 'make a commit', 'create a commit', 'commit this', 'commit my work', 'write a commit message', 'stage and commit', or otherwise requests help producing a git commit. Also triggers when the user wants to split a large change into multiple atomic commits, or asks for a good commit message for current work. Handles staging, pre-commit checks, multi-commit splitting, and message drafting in conventional commit style."
---

# Git Commit

Produce a clean git commit (or set of commits) from the current working tree. Analyze what changed, stage appropriately, run pre-commit checks, and write a conventional-style commit message that accurately describes the diff.

## Arguments

Parse the argument string for flags:

- **`--no-verify`**: skip pre-commit checks (lint, format). Only use if the user explicitly asked.
- **`--amend`**: amend the previous commit instead of creating a new one. Only use if the user explicitly asked.
- Any other text is treated as a commit message hint from the user — respect its intent but still clean it up to conventional format.

If no flags are passed, run the full workflow below.

## Workflow

### 1. Read the current repo state

Run these in parallel — they are independent:

```bash
git status --porcelain
git branch --show-current
git diff --cached --stat    # staged changes
git diff --stat             # unstaged changes
git log --oneline -5        # recent commits (for style reference)
```

### 2. Pre-commit checks

Unless the user passed `--no-verify`, run lint and format if the project has them configured. If checks fail, surface the failures and ask the user whether to fix first or proceed anyway — do not skip silently.

### 3. Staging

- If **any** files are already staged, only commit those. Do not auto-add more — the user curated the staging set deliberately.
- If **no** files are staged, stage all modified and new files with `git add` (specific paths, not `-A`, to avoid accidentally including `.env` or large binaries).

### 4. Analyze the diff

Look at `git diff --cached` after staging. Decide whether it's one logical change or several. Split when the diff crosses any of these lines:

- Different concerns (unrelated parts of the codebase)
- Different types of change mixed together (feature + fix + refactor)
- Source code changes mixed with documentation
- Logically separable pieces that would be easier to review apart
- Unusually large diff that would be clearer broken down

If you decide to split, tell the user the proposed split before running any commits, then stage and commit each group separately.

### 5. Write the commit message

Use conventional commit format: `<type>: <description>`.

Types:
- **feat** — new feature
- **fix** — bug fix
- **docs** — documentation only
- **style** — formatting, whitespace, etc. (no behavior change)
- **refactor** — code change that neither fixes a bug nor adds a feature
- **perf** — performance improvement
- **test** — adding or fixing tests
- **chore** — tooling, build, dependencies

Rules:
- Present tense, imperative mood ("add feature", not "added feature")
- First line under 72 characters
- Body (if needed) explains the **why**, not the **what** — the diff already shows what
- Match the style of recent commits from `git log --oneline -5`

### 6. Run the commit

**Always use multiple `-m` flags. Never use heredocs** — they fail in sandboxed environments.

```bash
git commit -m "feat: add user authentication" -m "Supports email and OAuth flows. Closes #123."
```

For `--amend`, pass `--amend` to `git commit` — but only if the user explicitly asked. Never amend a commit that has already been pushed to a shared branch unless the user confirms.

### 7. Verify

After committing, run `git status` and show the result. If you split commits, show the sequence of commits you created.

## Good commit message examples

- `feat: add user authentication system`
- `fix: resolve memory leak in rendering process`
- `docs: update API documentation with new endpoints`
- `refactor: simplify error handling logic in parser`
- `perf: cache serialization results for hot path`
- `chore: upgrade typescript to 5.4`
- `test: add unit tests for new solc version features`

## Split-commit example

A diff touching auth middleware, unrelated README cleanup, and a dependency bump should become:

1. `feat: add OAuth token refresh to auth middleware`
2. `docs: tidy README setup instructions`
3. `chore: bump axios to 1.7.2`

## Anti-patterns to avoid

- **Do not** use `git add -A` or `git add .` when no files are staged — list paths explicitly to avoid pulling in `.env`, credentials, or unrelated build artifacts.
- **Do not** commit files that look like secrets (`.env`, `credentials.json`, `*_key.pem`). If the user explicitly asks, warn them first.
- **Do not** skip pre-commit hooks with `--no-verify` as a way to get past a failing check. If a hook fails, diagnose the root cause.
- **Do not** write a vague message like `update code` or `fix stuff` — the message must describe the change.
- **Do not** amend commits that have been pushed unless the user explicitly confirms.
