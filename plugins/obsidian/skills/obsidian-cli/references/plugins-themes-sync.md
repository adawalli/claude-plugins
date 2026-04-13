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
/usr/local/bin/obsidian plugins                                # all installed plugins
/usr/local/bin/obsidian plugins filter=core                    # core plugins only
/usr/local/bin/obsidian plugins filter=community               # community plugins only
/usr/local/bin/obsidian plugins versions                       # include version numbers
/usr/local/bin/obsidian plugins format=json                    # JSON output

/usr/local/bin/obsidian plugins:enabled                        # enabled plugins only
/usr/local/bin/obsidian plugins:enabled filter=community versions
```

### Plugin Info

```
/usr/local/bin/obsidian plugin id="dataview"                   # plugin details
```

### Install/Uninstall Community Plugins

```
/usr/local/bin/obsidian plugin:install id="dataview"           # install
/usr/local/bin/obsidian plugin:install id="dataview" enable    # install and enable
/usr/local/bin/obsidian plugin:uninstall id="dataview"         # uninstall
```

### Enable/Disable

```
/usr/local/bin/obsidian plugin:enable id="dataview"            # enable
/usr/local/bin/obsidian plugin:disable id="dataview"           # disable
```

### Developer: Reload Plugin

```
/usr/local/bin/obsidian plugin:reload id="my-plugin"           # reload for development
```

### Restricted Mode

```
/usr/local/bin/obsidian plugins:restrict                       # check restricted mode status
/usr/local/bin/obsidian plugins:restrict on                    # enable restricted mode
/usr/local/bin/obsidian plugins:restrict off                   # disable restricted mode
```

## Themes

### List Themes

```
/usr/local/bin/obsidian themes                                 # installed themes
/usr/local/bin/obsidian themes versions                        # with version numbers
```

### Current Theme

```
/usr/local/bin/obsidian theme                                  # active theme info
/usr/local/bin/obsidian theme name="Minimal"                   # specific theme details
```

### Install/Set/Uninstall

```
/usr/local/bin/obsidian theme:install name="Minimal"           # install theme
/usr/local/bin/obsidian theme:install name="Minimal" enable    # install and activate
/usr/local/bin/obsidian theme:set name="Minimal"               # activate installed theme
/usr/local/bin/obsidian theme:set name=""                       # reset to default
/usr/local/bin/obsidian theme:uninstall name="Minimal"         # uninstall theme
```

### Toggle Light/Dark

```
/usr/local/bin/obsidian command id=theme:toggle-light-dark     # toggle mode
/usr/local/bin/obsidian command id=theme:switch                # switch theme
```

## CSS Snippets

```
/usr/local/bin/obsidian snippets                               # list installed snippets
/usr/local/bin/obsidian snippets:enabled                       # list enabled snippets
/usr/local/bin/obsidian snippet:enable name="custom"           # enable snippet
/usr/local/bin/obsidian snippet:disable name="custom"          # disable snippet
```

## Sync

### Control Sync

```
/usr/local/bin/obsidian sync:status                            # show sync status
/usr/local/bin/obsidian sync on                                # resume sync
/usr/local/bin/obsidian sync off                               # pause sync
```

### Sync History

```
/usr/local/bin/obsidian sync:history file="Note"               # sync version history
/usr/local/bin/obsidian sync:history file="Note" total         # version count
/usr/local/bin/obsidian sync:read file="Note" version=1        # read sync version
/usr/local/bin/obsidian sync:restore file="Note" version=3     # restore sync version
/usr/local/bin/obsidian sync:open file="Note"                  # open sync history UI
/usr/local/bin/obsidian sync:deleted                           # list deleted files in sync
/usr/local/bin/obsidian sync:deleted total                     # deleted file count
```

### Sync Commands

```
/usr/local/bin/obsidian command id=sync:open-sync-view         # open sync view
/usr/local/bin/obsidian command id=sync:open-sync-log          # open sync log
/usr/local/bin/obsidian command id=sync:setup                  # setup sync
/usr/local/bin/obsidian command id=sync:view-version-history   # view version history
```

## File History

Local file recovery (separate from sync):

```
/usr/local/bin/obsidian history file="Note"                    # list local versions
/usr/local/bin/obsidian history:list                            # files with history
/usr/local/bin/obsidian history:read file="Note"               # read latest version (default: 1)
/usr/local/bin/obsidian history:read file="Note" version=3     # read specific version
/usr/local/bin/obsidian history:restore file="Note" version=2  # restore version
/usr/local/bin/obsidian history:open file="Note"               # open file recovery UI
```

### File Recovery Command

```
/usr/local/bin/obsidian command id=file-recovery:open          # open file recovery
```

## Diff

Compare file versions:

```
/usr/local/bin/obsidian diff file="Note"                       # list all versions
/usr/local/bin/obsidian diff file="Note" filter=local          # local versions only
/usr/local/bin/obsidian diff file="Note" filter=sync           # sync versions only
/usr/local/bin/obsidian diff file="Note" from=1 to=3           # diff between versions
```
