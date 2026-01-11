---
description: "Invoke Ralph Loop to implement tasks from an existing tasks file via agent-os"
argument-hint: "ITERATIONS TASKS_FILE_PATH"
---

Invoke ralph-loop to implement tasks from the provided file.

- $1 = number of iterations (default: 10)
- $2 = path to tasks.md file

```
/ralph-loop:ralph-loop --max-iterations $1 --completion-promise "ALL_TASKS_COMPLETE" "Work through task groups in $2 ONE AT A TIME.

CRITICAL: Each iteration must focus on ONLY ONE task group:
1. Read the tasks file and find the FIRST incomplete task group
2. Create todos ONLY for that single task group's subtasks
3. Run /agent-os:implement-tasks with the tasks file path AND task group name
   (e.g., '/agent-os:implement-tasks $2 - Task Group 1: Core Types')
   The implementer is responsible for doing the work and checking off tasks.
4. End iteration - do NOT proceed to next group in same iteration

When ALL task groups in tasks.md are marked complete:
- Run /agent-os:implement-tasks with just the file path (no task group name)
  (e.g., '/agent-os:implement-tasks $2')
- The implementer will automatically run final verification and update roadmap.md

DO NOT create a master todo list for all task groups. Only track the current group's tasks.

Output <promise>ALL_TASKS_COMPLETE</promise> when the implementer marks this feature complete in @agent-os/product/roadmap.md"
```
