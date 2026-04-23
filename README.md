# Claude Plugins Marketplace

A curated marketplace registry for Claude Code plugins, skills, workflows, and productivity tools.

## Overview

This repository serves as a personal marketplace registry for Claude Code, providing access to
carefully selected plugins that enhance development workflows with TDD practices, debugging tools,
collaboration patterns, and proven techniques.

## Installation

### Add the Marketplace

To add this marketplace to your Claude Code installation:

```bash
/plugin marketplace add adawalli/claude-plugins
```

### Browse Available Plugins

After adding the marketplace, open the interactive plugin browser:

```bash
/plugin
```

This will show all available plugins from this marketplace along with their descriptions.

### Install a Plugin

Install plugins directly from this marketplace:

```bash
/plugin install core@adawalli
```

Replace `core` with the name of any plugin available in this registry.

## Available Plugins

### core

**Description:** Core skills library with TDD, debugging, collaboration patterns, and proven
techniques

**Source:** [github.com/adawalli/claude-core](https://github.com/adawalli/claude-core.git)

**Keywords:** skills, tdd, debugging, collaboration, best-practices, workflows

**Install:**

```bash
/plugin install core@adawalli
```

### youtube

**Description:** YouTube video discovery and ranking - find top videos by composite score using yt-dlp

**Keywords:** youtube, yt-dlp, video, search, ranking

**Install:**

```bash
/plugin install youtube@adawalli
```

**Prerequisites:**

- [bun](https://bun.sh) - TypeScript runtime
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - YouTube metadata extractor

```bash
# Install bun
curl -fsSL https://bun.sh/install | bash

# Install yt-dlp
uv tool install "yt-dlp[default]"
# or: brew install yt-dlp
# or: pip install yt-dlp
```

**Usage:**

```
/youtube-top-videos top 10 videos on connecting NotebookLM to Claude Code
/youtube-top-videos best talks on AI agent architectures 5
```

Expands your query into 3 search variations, fetches up to 25 candidates per variation via yt-dlp, filters out irrelevant results, deduplicates, and ranks by a composite score based on views (30%), engagement (25%), recency (25%), and channel authority (20%). Returns a markdown table of the top N results (default 10).

## Use These Skills From Other Agents (Codex, OpenCode, Cursor, etc.)

This repo doubles as a [Vercel `skills`](https://github.com/vercel-labs/skills) source. Non-Claude
agents can install the portable skills via `npx skills`, which reads this repo's `marketplace.json`
directly - no separate publish step.

```bash
# List portable skills
npx skills add adawalli/claude-plugins --list

# Install one skill globally for Codex
npx skills add adawalli/claude-plugins --skill problem-solving -g -a codex -y

# Install all portable skills to every detected agent, globally
npx skills add adawalli/claude-plugins --all -g

# Update later
npx skills update
```

What's portable and what isn't:

- **Portable skills** (work across 45+ agents): `problem-solving`, `receiving-code-review`,
  `cassette-flows`, `action-items`, `obsidian-cli`, `youtube-top-videos`
- **Claude-Code-only** (intentionally hidden from `skills --list`): `code-review` uses the Agent tool
  to orchestrate subagents - set `INSTALL_INTERNAL_SKILLS=1` if you want it visible anyway
- **Not distributed via skills CLI**: subagents in `plugins/core/agents/`, hooks in
  `opus-gatekeeper/`, slash commands (`git-commit`, `obsidian-orphans`, `ralph-orchestrate`) - these
  remain Claude-Code-only

## Managing Plugins

### Enable/Disable

```bash
/plugin enable core@adawalli
/plugin disable core@adawalli
```

### Uninstall

```bash
/plugin uninstall core@adawalli
```

### Check Installed Plugins

Use the `/plugin` command to see all installed plugins and their status.

## Team Setup

For team-wide automatic installation, add this marketplace and desired plugins to your repository's
`.claude/settings.json`:

```json
{
  "plugins": {
    "marketplaces": ["adawalli/claude-plugins"],
    "autoInstall": ["core@adawalli"]
  }
}
```

Team members who trust the repository will automatically have these plugins installed.

## Marketplace Structure

```
.claude-plugin/
└── marketplace.json    # Plugin registry definition
```

The `marketplace.json` file defines:

- Marketplace metadata (name, owner, description, version)
- Available plugins with their sources and configurations
- Plugin descriptions, keywords, and version information

## Requirements

- Claude Code CLI installed
- Git access to plugin source repositories
- Basic familiarity with Claude Code commands

## Support

For issues with specific plugins, refer to their individual repositories. For marketplace-related
issues, open an issue in this repository.
