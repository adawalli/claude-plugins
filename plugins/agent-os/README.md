# Agent-OS Plugin

Orchestration commands for [agent-os](https://github.com/buildermethods/agent-os) spec-driven
development.

## Prerequisites

This plugin integrates two separate systems. Both must be installed for the commands to work:

### 1. Ralph Loop Plugin (from Anthropic)

The official Ralph Loop plugin provides the iterative loop mechanism.

```
/plugins install ralph-loop@claude-plugins-official
```

This provides `/ralph-loop:ralph-loop` which handles the iteration logic, stop hooks, and completion
promises.

### 2. Agent-OS (from buildermethods)

Agent-OS is a spec-driven development framework that gets installed per-project. It provides the
implementation commands and workflows.

- Repository: https://github.com/buildermethods/agent-os
- Installed into your project's `.claude/` directory
- Provides commands like `/agent-os:implement-tasks` via `.claude/commands/agent-os/`

## Commands

### /agent-os:ralph-orchestrate

Orchestrates Ralph Loop to implement tasks from a tasks.md file.

**Usage:**

```
/agent-os:ralph-orchestrate ITERATIONS TASKS_FILE_PATH
```

**Arguments:**

- `ITERATIONS` - Maximum number of Ralph Loop iterations (default: 10)
- `TASKS_FILE_PATH` - Path to the tasks.md file containing task groups

**Example:**

```
/agent-os:ralph-orchestrate 10 agent-os/specs/my-feature/tasks.md
```

**How it works:**

1. Invokes `/ralph-loop:ralph-loop` with the task processing prompt
2. Each iteration reads the tasks file and finds the first incomplete task group
3. Calls `/agent-os:implement-tasks` (from project-level agent-os) for that group
4. Processes task groups one at a time across iterations
5. Runs final verification when all tasks complete

## Architecture

This plugin acts as a bridge between two systems:

```
+---------------------------+
|  This Plugin              |
|  (agent-os@adawalli)      |
|                           |
|  /agent-os:ralph-         |
|   orchestrate             |
+-----------+---------------+
            |
            | invokes
            v
+---------------------------+
|  Ralph Loop Plugin        |
|  (claude-plugins-official)|
|                           |
|  /ralph-loop:ralph-loop   |
|  - Iteration management   |
|  - Stop hooks             |
|  - Completion promises    |
+-----------+---------------+
            |
            | calls per iteration
            v
+---------------------------+
|  Project-Level Agent-OS   |
|  (buildermethods/agent-os)|
|                           |
|  /agent-os:implement-tasks|
|  - Task implementation    |
|  - Spec management        |
|  - Verification           |
+---------------------------+
```

## Related Links

- [Ralph Loop Plugin](https://github.com/anthropics/claude-plugins-official) - Official plugin
  repository
- [Agent-OS](https://github.com/buildermethods/agent-os) - Spec-driven development framework
- [Ralph Wiggum Technique](https://ghuntley.com/ralph/) - Original methodology
