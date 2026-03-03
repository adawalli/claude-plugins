---
name: youtube-top-videos
description: Find and rank top YouTube videos for any topic. Searches YouTube via yt-dlp with query expansion and scores results by views, engagement, recency, and channel authority. Use when the user asks to find top/best YouTube videos, search YouTube, rank videos, or discover quality video content on a topic.
argument-hint: "[query] [number-of-results]"
---

# YouTube Top Videos

Find the top N YouTube videos for a query, ranked by a composite quality score. Uses query expansion to search multiple phrasings and surface a broader set of results.

## Execution

### Step 1: Parse Arguments and Generate Query Variations

Parse `$ARGUMENTS` for the search query and optional result count N (default 10).

Generate exactly 3 search queries:
1. The user's original query (always first)
2. A rephrased variation using synonyms or different word order
3. A broader or narrower variation targeting related content

Good variations surface different videos - aim for meaningfully different phrasings, not minor tweaks. Example for "python web scraping":
- "python web scraping" (original)
- "python beautifulsoup requests tutorial" (specific tools)
- "scrape websites with python beginner" (different angle)

### Step 2: Run Searches in Parallel

Run the ranking script for all 3 queries using parallel Bash tool calls (one per query). Always request 10 results per run regardless of the user's N:

```bash
bun run ${CLAUDE_PLUGIN_ROOT}/scripts/rank-videos.ts <query-variation> 10
```

### Step 3: Merge and Deduplicate

Combine results from all runs into a single list:

1. Parse each run's stdout as JSON (`{ query, total, results }`)
2. Deduplicate by `id` field - when a video appears in multiple result sets, keep the entry with the highest `score` and add +0.03 for each additional appearance
3. Sort by adjusted score descending
4. Take top N results (user's requested count, default 10)

### Step 4: Present Results

Output the merged results as a single markdown table, constructing links from the `id` field:

| # | Score | Title | Channel | Views | Likes | Age | Link |

Where Link is `https://youtube.com/watch?v={id}`.

After the table, add a brief summary noting patterns (common themes, recency trends, standout channels) and mention the query variations used.

## Prerequisites

- **yt-dlp**: Install via `uv tool install "yt-dlp[default,curl-cffi]"`
- **bun**: TypeScript runtime

## Notes

- Each script run fetches 25 candidates and ranks by weighted score (views 30%, likes 25%, recency 25%, followers 20%)
- Runs execute in parallel so total time is ~30-60 seconds (same as a single query)
- Deduplication works by matching the `id` field from JSON results; videos appearing across multiple query variations get a score boost, surfacing broadly relevant content
- If the script reports errors, verify yt-dlp is installed: `yt-dlp --version`
