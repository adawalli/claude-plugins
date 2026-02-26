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
