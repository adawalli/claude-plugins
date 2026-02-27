---
name: obsidian-cli
description: "Operate Obsidian vaults via the `obsidian` CLI - create/read/edit notes, manage properties and tags, search vault content, handle daily notes and templates, manage plugins and themes, work with bases, control sync and file history, manipulate workspace layout, and use developer tools. Use when the user asks to interact with their Obsidian vault, manage notes, query vault data, automate Obsidian workflows, or debug Obsidian plugins. Triggers: mentions of Obsidian, vault operations, note management, obsidian CLI, daily notes, or working with .md files in an Obsidian context."
---

# Obsidian CLI

CLI reference based on Obsidian v1.12.4 (installer 1.11.7). All commands:
`obsidian <command> [options]`.

## CRITICAL: Sandbox Requirement

**Every `obsidian` command MUST be run with `dangerouslyDisableSandbox: true`. No exceptions.**

The `obsidian` CLI communicates with the running Obsidian Desktop app via a Unix socket (IPC).
The Claude Code sandbox blocks Unix socket access entirely - commands will fail silently or with
cryptic connection errors until you disable the sandbox. This is not a transient issue; it is a
hard architectural constraint.

**Before running any `obsidian` command:**

1. Set `dangerouslyDisableSandbox: true` on the Bash tool call
2. Confirm Obsidian Desktop is open (the CLI requires an active app connection)

`dangerouslyDisableSandbox: true` does not bypass the user's permission model - the user will
still be prompted to approve the command before it runs. It only removes the filesystem/network
sandbox that prevents Unix socket access.

Attempting `obsidian` commands without disabling the sandbox will always fail.

**CLI version note:** This reference was built against Obsidian v1.12.4. If commands behave
unexpectedly, run `obsidian version` and `obsidian help <command>` to check for changes.

## Conventions

- `file=<name>` resolves by name (like wikilinks). `path=<path>` is exact (folder/note.md).
- Most commands default to the active file when file/path is omitted.
- Quote values with spaces: `name="My Note"`. Use `\n` for newline, `\t` for tab.
- Target a specific vault: `obsidian vault=<name> <command>`.
- Output formats: many commands accept `format=json|tsv|csv` (default varies).
- Use `total` flag on list commands to get counts instead of full output.

## Quick Reference

| Need           | Command        | Example                                                    |
| -------------- | -------------- | ---------------------------------------------------------- |
| Read a note    | `read`         | `obsidian read file="My Note"`                             |
| Create a note  | `create`       | `obsidian create name="New Note" content="# Hello"`        |
| Append to note | `append`       | `obsidian append file="Log" content="Entry"`               |
| Search vault   | `search`       | `obsidian search query="meeting agenda"`                   |
| Daily note     | `daily`        | `obsidian daily`                                           |
| List files     | `files`        | `obsidian files folder="Projects"`                         |
| Get properties | `properties`   | `obsidian properties file="Note"`                          |
| Set property   | `property:set` | `obsidian property:set name=status value=done file="Task"` |
| List tags      | `tags`         | `obsidian tags counts sort=count`                          |
| Find backlinks | `backlinks`    | `obsidian backlinks file="Topic"`                          |
| Run command    | `command`      | `obsidian command id=editor:toggle-bold`                   |
| List vaults    | `vaults`       | `obsidian vaults verbose`                                  |

## Command Domains

Obsidian CLI has 75+ commands across these domains. Load the relevant reference for detailed usage:

### Vault and Files

Create, read, append, prepend, delete, move, rename files and folders. Search vault content. See
[references/vault-and-files.md](references/vault-and-files.md)

### Knowledge Graph

Backlinks, outgoing links, orphans, dead-ends, tags, properties, aliases, outline headings. See
[references/knowledge-graph.md](references/knowledge-graph.md)

### Daily Notes and Templates

Daily note operations (open, read, append, prepend), templates, bookmarks. See
[references/daily-and-templates.md](references/daily-and-templates.md)

### Plugins, Themes, and Sync

Plugin management (install/enable/disable), themes, CSS snippets, sync control, file history. See
[references/plugins-themes-sync.md](references/plugins-themes-sync.md)

### Workspace and UI

Tabs, workspace layout, window management, executing commands, hotkeys. See
[references/workspace-and-ui.md](references/workspace-and-ui.md)

### Bases

Create, query, and manage base views (Obsidian's structured data feature). See
[references/bases.md](references/bases.md)

### Developer Tools

JavaScript eval, DOM inspection, CSS debugging, CDP protocol, console capture, screenshots. See
[references/developer-tools.md](references/developer-tools.md)

## Tasks

Obsidian tracks checkbox items (`- [ ]`) across notes:

```
obsidian tasks                          # list all tasks
obsidian tasks todo                     # incomplete only
obsidian tasks done                     # completed only
obsidian tasks file="Project"           # tasks in specific file
obsidian tasks daily                    # tasks from daily note
obsidian task file="Todo" line=5 toggle # toggle a task
obsidian task file="Todo" line=5 done   # mark done
obsidian task file="Todo" line=5 status="/" # custom status char
```

## Parsing Output

When processing command output, prefer CLI tools over Python. Check availability first:

```bash
command -v jq   # JSON parsing
command -v yq   # YAML/JSON parsing (supports both)
command -v gawk # field/column processing
```

**JSON output** (`format=json`): use `jq` if available.

```bash
obsidian files format=json | jq '.[].path'
obsidian properties file="Note" format=json | jq '.tags[]'
obsidian search query="meeting" format=json | jq '.[] | {file, line}'
```

**YAML/JSON** (`format=json` or properties): use `yq` if available, falls back to `jq`.

```bash
obsidian properties file="Note" format=json | yq '.status'
```

**TSV/CSV output**: use `awk`, `cut`, or `column` - no external deps needed.

```bash
obsidian files format=tsv | awk -F'\t' '{print $1}'
obsidian tags format=tsv | column -t -s $'\t'
```

Only fall back to Python when the above tools are not available or the transformation is too complex for them.

## Tips

- Pipe JSON output to jq for filtering: `obsidian files format=json | jq '.[]'`
- Chain operations: read a template, create from it, set properties
- Use `search:context` instead of `search` when you need matching line context
- `obsidian commands filter=editor` to discover commands by prefix
- `obsidian hotkeys all` shows every command including those without keybindings
- Run `obsidian` with no arguments for full help
