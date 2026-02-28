---
allowed-tools: Bash(obsidian *), Read, Edit, mcp__qmd__status, mcp__qmd__search, mcp__qmd__vector_search, mcp__qmd__deep_search, mcp__qmd__get, mcp__qmd__multi_get
argument-hint: [count=10]
description: Find and improve orphaned Obsidian notes by enriching frontmatter and adding wikilink connections
---

# Obsidian Orphan Rescue

Process orphaned notes and connect them to the knowledge graph.

**Target count:** $ARGUMENTS (default: 10)

## Prerequisites

- Obsidian Desktop must be running (CLI communicates via Unix socket)
- All `obsidian` commands require `dangerouslyDisableSandbox: true`

## Step 0: Check QMD Availability

Before starting, determine if QMD is available and has the vault indexed:

1. Call `mcp__qmd__status` to check if the QMD MCP server is reachable
2. If it responds, look for a collection whose path matches the Obsidian vault (typically named `obsidian`)
3. Set a flag for the rest of the workflow:
   - **QMD available** - collection exists with documents indexed. Use QMD as primary search in Step 2c.
   - **QMD unavailable** - server not reachable, no matching collection, or 0 documents. Skip Step 2c entirely and use Obsidian search (Step 2d) as the primary method.

If QMD is unavailable, tell the user once at the start:
> "QMD isn't available for this vault - using Obsidian's built-in search to find connections. For better semantic matching in future runs, consider adding your vault to QMD with `qmd add <vault-path>`."

## Step 1: Discover Orphans

Run `obsidian orphans` to get the full list.

**Filter the list** before selecting notes to process:
- Skip non-markdown files (images, PDFs, audio, canvases, etc.)
- Skip `Templates/` directory files
- Skip `Attachments/` directory files
- Skip special files: `CLAUDE.md`, `Start Here.md`, `Home.md`

Parse the count from `$ARGUMENTS` (default to 10 if empty or not a number). Select that many orphans from the filtered list, aiming for a diverse mix of topics/locations.

Show the user a numbered list of the selected orphans before proceeding.

## Step 2: Process Orphans in Parallel Batches

Process notes in batches of 3-5 to maximize parallelism. Within each batch:

### 2a. Read Notes (parallel)

Read all notes in the batch with parallel `obsidian read` calls.

```
obsidian read file="<note name>"
```

**Important:** `obsidian read` fails silently - if it returns empty output with no error, that means `file=` resolution failed. Immediately retry with `path=` using the full path from the orphans list:

```
obsidian read path="3. Resources/Work/Example/Note-name.md"
```

### 2b. Search for Connections (parallel)

Fire off all QMD searches for the batch in parallel - don't wait for one note's search before starting the next.

**Two-tier search strategy:**

1. **Start with `search` + `vector_search` in parallel** per orphan (~30ms + ~2s). This covers ~90% of cases.
2. **Escalate to `deep_search`** (~10s) only when both `search` and `vector_search` miss or return low-confidence results.

**How to query:** Write a natural language description focused on relationships, not just the topic.

- Good: `"notes related to drone pilot certification, aviation training, flight physics, or FAA regulations"`
- Bad: `"Part 107 training notes"` (just restates the title)

Use `collection: "obsidian"`, `limit: 10`. Exclude the orphan itself from results.

For the top candidates, use `mcp__qmd__get` to read enough of each to confirm the connection is genuine before creating links.

**Don't force connections.** Not every orphan has a natural backlink waiting for it. If search returns nothing convincing, that's fine - the note may just be standalone. In that case, focus on frontmatter enrichment (tags, properties) so the note becomes findable when a real connection emerges later. A well-tagged orphan is better than a contrived wikilink.

### 2c. Obsidian Search (fallback or primary)

Use `obsidian search query="<terms>"` when:
- **QMD is unavailable** (Step 0 determined no collection exists) - this becomes the primary search method
- **QMD returned no useful results** (all scores below threshold, or results are clearly unrelated)
- **Catching recent notes** that QMD may not have indexed yet

When this is the primary search method, run multiple searches per orphan with different keyword angles to compensate for the lack of semantic matching. For example, for an aviation training note, try both `obsidian search query="aviation"` and `obsidian search query="pilot training"`.

### 2d. Examine Vault Conventions

The vault uses these common frontmatter properties (respect existing conventions):

| Property   | Usage                                          |
| ---------- | ---------------------------------------------- |
| `tags`     | Hierarchical tags like `area`, `personal/home` |
| `source`   | Where the note came from (e.g. `apple-notes`)  |
| `vault`    | Which vault context (`personal`, `work`)       |
| `status`   | Note status (e.g. `active`, `done`)            |
| `date`     | Date associated with the note                  |
| `project`  | Associated project name                        |
| `summary`  | Brief summary of the note                      |

Common tag hierarchy:

- `#work`, `#personal`, `#resource`, `#area`, `#project`, `#meeting`, `#archive`
- Nested: `#work/platform-engineering`, `#work/career`, `#personal/home`, `#personal/finance`, etc.

### 2e. Improve the Note (parallel within batch)

Parallelize frontmatter `property:set` calls across notes in the batch. Prioritize making the note findable over forcing connections.

**Frontmatter enrichment (always do this):**

Add missing properties using the exact CLI syntax:

```
obsidian property:set name="summary" value="Brief description of the note" file="Note Name"
obsidian property:set name="vault" value="personal" file="Note Name"
```

- Match existing vault conventions for tag hierarchy and property values
- Don't overwrite existing properties unless they're clearly wrong
- Good tags make orphans discoverable even without wikilinks

**Wikilink connections (only when genuine):**
- If search found genuinely related notes, add `[[wikilinks]]` where they make natural sense
- Place links in a "Related" or "See also" section, or inline in context
- Add a related notes section with: `obsidian append file="Note Name" content="\n\n## Related\n- [[Other Note]] - brief reason"`
- If a note already has a Related section with placeholder content, use the `Edit` tool (requires `Read` first) to replace the placeholder instead of appending a duplicate section
- Only link to notes that actually exist in the vault
- Use the note's **title** (not file path) for the wikilink text
- Where it makes sense, add a `[[wikilink]]` back from related notes to resolve orphan status

**When no connections exist:**
- Don't invent links just to de-orphan. Tags and properties are the right tool here.
- Note it in the summary as "enriched frontmatter, no natural connections found"
- The note will get linked organically when related content is created later

## Step 3: Verify (batch)

After processing **all** notes, run all `obsidian backlinks` checks in parallel:

```
obsidian backlinks file="<note>"
```

This confirms which notes now have incoming links. Do this as a single batch at the end, not after each individual note.

## Step 4: Summary

After processing all notes, present a summary table:

| Note | Frontmatter Added | Links Created | Connected? |
| ---- | ----------------- | ------------- | ---------- |
| ...  | tags, vault       | 3 outgoing, 1 incoming | Yes |

Include:
- Total orphans processed vs successfully connected
- Any notes that couldn't be connected (and why)
- QMD search quality notes (were semantic matches useful?)

## Important Guidelines

- Be conservative with edits - improve, don't rewrite
- Frontmatter enrichment is always valuable; wikilinks are only valuable when the connection is real
- Don't force every orphan into a connection - well-tagged standalone notes are a fine outcome
- Only add frontmatter properties that genuinely apply
- Ask the user before making changes if you're unsure about a connection
- Maximize parallel tool calls: batch reads, batch searches, batch property:set, batch verification
