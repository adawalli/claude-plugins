---
name: youtube-top-videos
description: Find and rank top YouTube videos for any topic. Searches YouTube via yt-dlp and scores results by views, engagement, recency, and channel authority. Use when the user asks to find top/best YouTube videos, search YouTube, rank videos, or discover quality video content on a topic.
argument-hint: "[query] [number-of-results]"
---

# YouTube Top Videos

Find the top N YouTube videos for a query, ranked by a composite quality score.

## Execution

Run the ranking script with `$ARGUMENTS` (query and optional result count, default 10):

```bash
bun run ${CLAUDE_PLUGIN_ROOT}/scripts/rank-videos.ts $ARGUMENTS
```

Present the script's stdout (a ranked markdown table) directly to the user, then add a brief summary noting patterns in the results (common themes, recency trends, standout channels).

## Prerequisites

- **yt-dlp**: Install via `uv tool install "yt-dlp[default]"`
- **bun**: TypeScript runtime

## Notes

- The script fetches 25 candidates and ranks by weighted score (views 30%, likes 25%, recency 25%, followers 20%)
- Execution takes 30-60 seconds due to full video metadata extraction
- If the script reports errors, verify yt-dlp is installed: `yt-dlp --version`
