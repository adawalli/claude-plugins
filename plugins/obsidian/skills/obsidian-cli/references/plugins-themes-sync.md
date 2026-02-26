# Plugins, Themes, and Sync

Reference for plugin management, themes, CSS snippets, sync, and file history. Based on Obsidian CLI
v1.12.4.

## Table of Contents

- [Plugins](#plugins)
- [Themes](#themes)
- [CSS Snippets](#css-snippets)
- [Sync](#sync)
- [File History](#file-history)
- [Diff](#diff)

## Plugins

### List Plugins

```
obsidian plugins                                # all installed plugins
obsidian plugins filter=core                    # core plugins only
obsidian plugins filter=community               # community plugins only
obsidian plugins versions                       # include version numbers
obsidian plugins format=json                    # JSON output

obsidian plugins:enabled                        # enabled plugins only
obsidian plugins:enabled filter=community versions
```

### Plugin Info

```
obsidian plugin id="dataview"                   # plugin details
```

### Install/Uninstall Community Plugins

```
obsidian plugin:install id="dataview"           # install
obsidian plugin:install id="dataview" enable    # install and enable
obsidian plugin:uninstall id="dataview"         # uninstall
```

### Enable/Disable

```
obsidian plugin:enable id="dataview"            # enable
obsidian plugin:disable id="dataview"           # disable
```

### Developer: Reload Plugin

```
obsidian plugin:reload id="my-plugin"           # reload for development
```

### Restricted Mode

```
obsidian plugins:restrict                       # check restricted mode status
obsidian plugins:restrict on                    # enable restricted mode
obsidian plugins:restrict off                   # disable restricted mode
```

## Themes

### List Themes

```
obsidian themes                                 # installed themes
obsidian themes versions                        # with version numbers
```

### Current Theme

```
obsidian theme                                  # active theme info
obsidian theme name="Minimal"                   # specific theme details
```

### Install/Set/Uninstall

```
obsidian theme:install name="Minimal"           # install theme
obsidian theme:install name="Minimal" enable    # install and activate
obsidian theme:set name="Minimal"               # activate installed theme
obsidian theme:set name=""                       # reset to default
obsidian theme:uninstall name="Minimal"         # uninstall theme
```

### Toggle Light/Dark

```
obsidian command id=theme:toggle-light-dark     # toggle mode
obsidian command id=theme:switch                # switch theme
```

## CSS Snippets

```
obsidian snippets                               # list installed snippets
obsidian snippets:enabled                       # list enabled snippets
obsidian snippet:enable name="custom"           # enable snippet
obsidian snippet:disable name="custom"          # disable snippet
```

## Sync

### Control Sync

```
obsidian sync:status                            # show sync status
obsidian sync on                                # resume sync
obsidian sync off                               # pause sync
```

### Sync History

```
obsidian sync:history file="Note"               # sync version history
obsidian sync:history file="Note" total         # version count
obsidian sync:read file="Note" version=1        # read sync version
obsidian sync:restore file="Note" version=3     # restore sync version
obsidian sync:open file="Note"                  # open sync history UI
obsidian sync:deleted                           # list deleted files in sync
obsidian sync:deleted total                     # deleted file count
```

### Sync Commands

```
obsidian command id=sync:open-sync-view         # open sync view
obsidian command id=sync:open-sync-log          # open sync log
obsidian command id=sync:setup                  # setup sync
obsidian command id=sync:view-version-history   # view version history
```

## File History

Local file recovery (separate from sync):

```
obsidian history file="Note"                    # list local versions
obsidian history:list                            # files with history
obsidian history:read file="Note"               # read latest version (default: 1)
obsidian history:read file="Note" version=3     # read specific version
obsidian history:restore file="Note" version=2  # restore version
obsidian history:open file="Note"               # open file recovery UI
```

### File Recovery Command

```
obsidian command id=file-recovery:open          # open file recovery
```

## Diff

Compare file versions:

```
obsidian diff file="Note"                       # list all versions
obsidian diff file="Note" filter=local          # local versions only
obsidian diff file="Note" filter=sync           # sync versions only
obsidian diff file="Note" from=1 to=3           # diff between versions
```
