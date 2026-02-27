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

The default owner is `Adam`. If the user specifies a different name (e.g. "find tasks for Sarah"), use that name instead. The name must match the wikilink tag used in meeting notes (e.g. `[[Sarah]]`).

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

Group results in two sections:
1. **From Daily Notes** - personal todos, attributed by date (only shown for default owner)
2. **From Meeting Notes** - include the meeting title as context for each item

Show a total count at the end.

## Output Format

```
**From Daily Notes**

1. <task text> *(YYYY-MM-DD)*
2. <task text> *(YYYY-MM-DD)*

**From Meeting Notes**

3. <task description> *(Meeting Title)*
4. <task description> *(Meeting Title)*

---
X open items total
```

Strip the `[[Name]]:` prefix and wikilink brackets from meeting note tasks for cleaner output.
Strip `[[wikilinks]]` formatting from all task text, converting them to plain text.
