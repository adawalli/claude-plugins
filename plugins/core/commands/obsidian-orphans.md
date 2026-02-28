---
allowed-tools: Bash(obsidian *)
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

Run `obsidian orphans` to get the full list. Parse the count from `$ARGUMENTS` (default to 10 if empty or not a number). Select that many orphans to process.

Show the user a numbered list of the selected orphans before proceeding.

## Step 2: For Each Orphan

Process each note one at a time:

### 2a. Read the Note

```
obsidian read file="<note name>"
```

If `file=` resolution fails, try `path=` with the full path from the orphans list.

### 2b. Analyze Content

Understand what the note is about. Identify:

- **Topic/domain** - what subject area does this belong to?
- **Type** - is it a reference, project, area, meeting, journal entry, daily note?
- **Key concepts** - extract 3-5 terms that capture what this note is really about

### 2c. Find Related Notes with QMD

Use **QMD semantic search** (`mcp__qmd__vector_search`) against the `obsidian` collection to find thematically related notes. This catches connections that keyword matching would miss - notes that discuss the same concepts but use different vocabulary.

**Search strategy - run in parallel:**

1. `mcp__qmd__vector_search` - describe the note's core topic in natural language (e.g., "drone pilot certification and aerodynamics training"). Use `collection: "obsidian"`, `limit: 10`, `minScore: 0.4`.
2. `mcp__qmd__search` - search for 2-3 specific keywords or phrases from the note (e.g., `"Part 107" drone`). Use `collection: "obsidian"`, `limit: 10`.

**Combine and deduplicate** results from both searches. Exclude the orphan itself. For the top candidates, use `mcp__qmd__get` to read enough of each to confirm the connection is real.

**Why QMD over `obsidian search`:** QMD's vector search finds semantically adjacent notes even when they share no keywords. A note about "aerodynamics lift drag" will match notes about "flight physics" or "wing design" that `obsidian search` would miss entirely. The keyword search (`mcp__qmd__search`) complements this with exact-match precision for identifiers, names, and technical terms.

### 2d. Obsidian Search (fallback or primary)

Use `obsidian search query="<terms>"` when:
- **QMD is unavailable** (Step 0 determined no collection exists) - this becomes the primary search method
- **QMD returned no useful results** (all scores below threshold, or results are clearly unrelated)
- **Catching recent notes** that QMD may not have indexed yet

When this is the primary search method, run multiple searches per orphan with different keyword angles to compensate for the lack of semantic matching. For example, for an aviation training note, try both `obsidian search query="aviation"` and `obsidian search query="pilot training"`.

### 2e. Examine Vault Conventions

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

### 2f. Improve the Note

Make two types of improvements:

**Frontmatter enrichment:**
- Add missing properties that fit the note's content
- Use `obsidian property:set` to add/update properties
- Match existing vault conventions for tag hierarchy and property values
- Don't overwrite existing properties unless they're clearly wrong

**Wikilink connections (in the note body):**
- Add `[[wikilinks]]` to related notes found via QMD
- Place links naturally in context - in a "Related" or "See also" section, or inline where they make sense
- Use `obsidian append` to add a related notes section if one doesn't exist
- Only link to notes that actually exist in the vault
- Use the note's **title** (not file path) for the wikilink text

**Wikilink connections (in related notes):**
- Where it makes sense, add a `[[wikilink]]` back to this orphan from related notes
- This is what actually resolves the orphan status - incoming links
- Use `obsidian append file="<related note>" content="\n- [[<orphan note>]]"` or similar

## Step 3: Verify

After processing each note, run `obsidian backlinks file="<note>"` to confirm it now has at least one incoming link.

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
- Prefer adding links in existing related notes over modifying the orphan itself
- Only add frontmatter properties that genuinely apply
- Don't invent connections that don't exist - if a note is truly standalone, say so
- Ask the user before making changes if you're unsure about a connection
- Process notes in batches of 3-5, showing progress as you go
- When QMD vector search returns high-confidence matches (score > 0.6), those connections are almost certainly worth linking
