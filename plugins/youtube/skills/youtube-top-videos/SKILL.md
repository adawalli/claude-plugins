---
name: youtube-top-videos
description: Find and rank top YouTube videos for any topic. Searches YouTube via yt-dlp with query expansion and scores results by views, engagement, recency, and channel authority. Use when the user asks to find top/best YouTube videos, search YouTube, rank videos, or discover quality video content on a topic.
---

# YouTube Top Videos

Find the top N YouTube videos for a query, ranked by a composite quality score.

## Execution

Parse `$ARGUMENTS` for the search query and optional result count N (default 10).

**Resolve script paths:** This skill's base directory is shown in the system reminder. The plugin's scripts directory is two levels up from the skill base directory, under `scripts/`. Compute the absolute paths to `rank-videos.ts` and `merge-results.ts`.

Launch the `video-ranker` agent with a prompt that includes:

> Search YouTube for the top N videos about: {query}
>
> Script paths (use these exactly):
> - Rank: {resolved_scripts_dir}/rank-videos.ts
> - Merge: {resolved_scripts_dir}/merge-results.ts

The agent handles query expansion, searching, relevance filtering, deduplication, and presenting the final ranked table.

## Prerequisites

- **yt-dlp**: Install via `uv tool install "yt-dlp[default,curl-cffi]"`
- **bun**: TypeScript runtime
