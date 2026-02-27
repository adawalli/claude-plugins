---
name: action-items
description: This skill should be used when the user asks to "find my open action items", "show my tasks", "what do I need to do", "list my todos", "find tasks assigned to me", "find tasks for [name]", or "what are my open items". Retrieves all open action items from meeting notes (tasks tagged with a person's name) and daily notes (unchecked checkboxes) across the Obsidian vault.
argument-hint: "[name]"
---

# Action Items

Retrieves all open action items across the Obsidian vault - combining tasks assigned by name in meeting notes with personal todos from daily notes.

## CRITICAL: Sandbox Requirement

Every `obsidian` command MUST be run with `dangerouslyDisableSandbox: true`. No exceptions. The obsidian CLI uses Unix socket IPC which the sandbox blocks.

## Vault Structure

Daily notes live in `Daily/` (named `YYYY-MM-DD.md`).
Meeting notes live in `Meetings/Work/` and `Meetings/Personal/`.

The obsidian CLI resolves the active vault automatically - no hardcoded paths needed.

## Owner Name

Use `$ARGUMENTS` as the owner name if provided (e.g. `/action-items Sarah`). Default to `Adam` when no argument is given. The name must match the wikilink tag used in meeting notes (e.g. `[[Sarah]]`).

## Retrieval Process

### Step 1: Meeting Note Action Items

Run `obsidian tasks todo` and filter for tasks tagged with the owner's name. Replace `OWNER` with the resolved name:

```bash
obsidian tasks todo format=json 2>&1 | jq --arg name "OWNER" '[.[] | select(.text | test("\\[\\[\($name)\\]\\]"))]'
```

This returns tasks of the form `- [ ] [[OWNER]]: <description>` found across all notes.

### Step 2: Daily Note Todos

Daily notes use first-person tasks (no name tag). Only include these when the owner is the default user (Adam). Filter by file path:

```bash
obsidian tasks todo format=json 2>&1 | jq '[.[] | select(.file | startswith("Daily/")) | select(.text | length > 6)]'
```

The `length > 6` check filters out empty checkboxes (`- [ ] ` is 6 chars).

### Step 3: Present Combined Results

Present results as three separate tables, in this order:
1. **Meetings** - tasks from `Meetings/` notes (only shown when results exist)
2. **Daily** - personal todos from `Daily/` notes (only shown for default owner, when results exist)
3. **Projects** - tasks from any other path not matching the above (only shown when results exist)

Show a total count at the end.

## Output Format

Each section is a markdown table with columns: `#`, `Task`, `Source`.

- **Meetings table**: `Source` = meeting title (filename without date prefix and `.md`)
- **Daily table**: `Source` = the date (YYYY-MM-DD extracted from filename)
- **Projects table**: `Source` = the file path

```
### Meetings

| # | Task | Source |
|---|------|--------|
| 1 | Confirm Glean doc searchability | Teleport and Charon Updates |
| 2 | Start SailPoint SCIM testing | Teleport and Charon Updates |

### Daily

| # | Task | Source |
|---|------|--------|
| 3 | Destroy EC2 instances for Mike Beiter Demo | 2026-02-26 |

---
X open items total
```

Numbers are sequential across all tables (meetings start at 1, daily continues the count, projects continues after that).

Strip the `[[Name]]:` prefix and wikilink brackets from all task text for clean output.
Strip markdown link syntax (e.g. `[text](url)`) down to just the `text` portion.
Strip `[[wikilinks]]` formatting from all task text, converting them to plain text.
Strip the `- [ ] ` checkbox prefix from task text.
