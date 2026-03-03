---
name: youtube-top-videos
description: Find and rank top YouTube videos for any topic. Searches YouTube via yt-dlp with query expansion and scores results by views, engagement, recency, and channel authority. Use when the user asks to find top/best YouTube videos, search YouTube, rank videos, or discover quality video content on a topic.
---

# YouTube Top Videos

Find the top N YouTube videos for a query, ranked by a composite quality score.

## Execution

Parse `$ARGUMENTS` for the search query and optional result count N (default 10).

The plugin's `scripts/` directory (containing `rank-videos.ts` and `merge-results.ts`) is two levels up from this skill's base directory.

### Step 1 - Generate query variations

Create 3 meaningfully different phrasings of the user's query:
- The original query unchanged
- A rephrased variation using synonyms or different word order
- A broader or narrower variation targeting related content

Good variations surface different videos - aim for meaningfully different phrasings, not minor tweaks.

### Step 2 - Run searches in parallel

Issue 3 Bash tool calls simultaneously (one per query variation), redirecting each output to a temp file:

```bash
bun run <rank-script-path> "<query-variation>" 25 > $TMPDIR/yt-search-1.json
```

Use `$TMPDIR` for all temp files with distinct filenames per run (e.g. `yt-search-1.json`, `yt-search-2.json`, `yt-search-3.json`). Always request 25 results per run to maximise the candidate pool for filtering.

### Step 3 - Relevance filter

Parse each temp file's JSON (`{ query, total, results }`). Read the title and description of every video. Remove videos that are clearly not about the user's intended topic. Be conservative - only remove obvious mismatches, not borderline cases.

Write the 3 filtered result objects as a JSON array to a combined temp file. Use `jq` if available, otherwise `python3 -m json.tool` for any JSON manipulation. Never pass large JSON through `echo` - video titles and descriptions contain quotes and special characters that break shell escaping.

### Step 4 - Merge and rank

Pipe the combined JSON file through the merge script:

```bash
bun run <merge-script-path> N --table < $TMPDIR/yt-combined.json
```

Where N is the requested result count. The merge script handles deduplication, scoring bonuses for videos found across multiple queries, sorting, and table formatting.

### Step 5 - Present results

Output the table from the merge script verbatim. Then add a brief 2-3 sentence summary noting patterns (common themes, recency trends, standout channels). If any results were filtered for relevance, briefly note what was removed.

**Important constraints:**
- Run all 3 searches in parallel for speed
- Be conservative when filtering - only remove clearly irrelevant results
- Do NOT sort results yourself - the merge script handles all ordering
- Reference videos by TITLE in the summary, never by number or position
- Keep the summary concise (2-3 sentences)
- Do NOT include raw description text in output

## Prerequisites

- **yt-dlp**: Install via `uv tool install "yt-dlp[default,curl-cffi]"`
- **bun**: TypeScript runtime
