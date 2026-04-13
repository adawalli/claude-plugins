# Workspace and UI

Reference for workspace layout, tabs, window management, commands, and hotkeys. Based on Obsidian
CLI v1.12.4.

## Table of Contents

- [Workspace](#workspace)
- [Tabs](#tabs)
- [Commands](#commands)
- [Hotkeys](#hotkeys)
- [Window and Navigation](#window-and-navigation)
- [Editor Commands](#editor-commands)

## Workspace

### View Workspace

```
/usr/local/bin/obsidian workspace                      # show workspace tree
/usr/local/bin/obsidian workspace ids                  # include workspace item IDs
```

### Workspace Commands

```
/usr/local/bin/obsidian command id=workspace:new-tab               # new tab
/usr/local/bin/obsidian command id=workspace:new-window             # new window
/usr/local/bin/obsidian command id=workspace:close                  # close current tab
/usr/local/bin/obsidian command id=workspace:close-others           # close other tabs
/usr/local/bin/obsidian command id=workspace:close-others-tab-group # close others in group
/usr/local/bin/obsidian command id=workspace:close-tab-group        # close tab group
/usr/local/bin/obsidian command id=workspace:close-window           # close window
/usr/local/bin/obsidian command id=workspace:split-horizontal       # horizontal split
/usr/local/bin/obsidian command id=workspace:split-vertical         # vertical split
/usr/local/bin/obsidian command id=workspace:toggle-pin             # pin/unpin tab
/usr/local/bin/obsidian command id=workspace:toggle-stacked-tabs    # toggle stacked tabs
/usr/local/bin/obsidian command id=workspace:undo-close-pane        # reopen closed tab
/usr/local/bin/obsidian command id=workspace:move-to-new-window     # move to new window
/usr/local/bin/obsidian command id=workspace:open-in-new-window     # open in new window
```

### Navigate Tabs

```
/usr/local/bin/obsidian command id=workspace:next-tab              # next tab
/usr/local/bin/obsidian command id=workspace:previous-tab          # previous tab
/usr/local/bin/obsidian command id=workspace:goto-tab-1            # go to tab 1-8
/usr/local/bin/obsidian command id=workspace:goto-last-tab         # go to last tab
```

### Copy Paths

```
/usr/local/bin/obsidian command id=workspace:copy-path             # copy relative path
/usr/local/bin/obsidian command id=workspace:copy-full-path        # copy full path
/usr/local/bin/obsidian command id=workspace:copy-url              # copy obsidian:// URL
```

### Export

```
/usr/local/bin/obsidian command id=workspace:export-pdf            # export as PDF
```

## Tabs

```
/usr/local/bin/obsidian tabs                           # list open tabs
/usr/local/bin/obsidian tabs ids                       # include tab IDs

/usr/local/bin/obsidian tab:open                       # open new tab
/usr/local/bin/obsidian tab:open file="Note.md"        # open file in tab
/usr/local/bin/obsidian tab:open group=<id>            # open in specific group
/usr/local/bin/obsidian tab:open view=<type>           # open specific view type
```

## Commands

### Execute a Command

```
/usr/local/bin/obsidian command id=editor:toggle-bold  # execute by command ID
```

### Discover Commands

```
/usr/local/bin/obsidian commands                       # list all 210+ command IDs
/usr/local/bin/obsidian commands filter=editor         # filter by prefix
/usr/local/bin/obsidian commands filter=workspace      # workspace commands
/usr/local/bin/obsidian commands filter=app            # app commands
/usr/local/bin/obsidian commands filter=file-explorer  # file explorer commands
```

Common command prefixes: `app:`, `editor:`, `workspace:`, `file-explorer:`, `graph:`, `bookmarks:`,
`backlink:`, `outline:`, `sync:`, `markdown:`, `note-composer:`, `bases:`.

## Hotkeys

```
/usr/local/bin/obsidian hotkeys                        # list bound hotkeys
/usr/local/bin/obsidian hotkeys all                    # include commands without hotkeys
/usr/local/bin/obsidian hotkeys total                  # hotkey count
/usr/local/bin/obsidian hotkeys verbose                # show if custom or default
/usr/local/bin/obsidian hotkeys format=json            # JSON output

/usr/local/bin/obsidian hotkey id=editor:toggle-bold   # hotkey for specific command
/usr/local/bin/obsidian hotkey id=editor:toggle-bold verbose  # show custom vs default
```

### Default Hotkeys (macOS)

| Action          | Hotkey               |
| --------------- | -------------------- |
| Settings        | `Cmd ,`              |
| Back/Forward    | `Cmd Opt Left/Right` |
| Help            | `F1`                 |
| Bold            | `Cmd B`              |
| Italic          | `Cmd I`              |
| Link            | `Cmd K`              |
| Save            | `Cmd S`              |
| Quick switcher  | `Cmd O`              |
| Command palette | `Cmd P`              |
| Search          | `Cmd Shift F`        |
| New note        | `Cmd N`              |

## Window and Navigation

```
/usr/local/bin/obsidian command id=app:go-back                 # navigate back
/usr/local/bin/obsidian command id=app:go-forward              # navigate forward
/usr/local/bin/obsidian command id=app:toggle-left-sidebar     # toggle left sidebar
/usr/local/bin/obsidian command id=app:toggle-right-sidebar    # toggle right sidebar
/usr/local/bin/obsidian command id=app:toggle-ribbon           # toggle ribbon
/usr/local/bin/obsidian command id=window:zoom-in              # zoom in
/usr/local/bin/obsidian command id=window:zoom-out             # zoom out
/usr/local/bin/obsidian command id=window:reset-zoom           # reset zoom
/usr/local/bin/obsidian command id=window:toggle-always-on-top # always on top
```

### Open Views

```
/usr/local/bin/obsidian command id=file-explorer:open          # file explorer
/usr/local/bin/obsidian command id=global-search:open          # search
/usr/local/bin/obsidian command id=graph:open                  # graph view
/usr/local/bin/obsidian command id=graph:open-local            # local graph
/usr/local/bin/obsidian command id=outline:open                # outline
/usr/local/bin/obsidian command id=tag-pane:open               # tag pane
/usr/local/bin/obsidian command id=backlink:open               # backlinks
/usr/local/bin/obsidian command id=outgoing-links:open         # outgoing links
/usr/local/bin/obsidian command id=properties:open             # global properties
/usr/local/bin/obsidian command id=properties:open-local       # local properties
/usr/local/bin/obsidian command id=bookmarks:open              # bookmarks
```

## Editor Commands

Formatting and editing via command IDs:

```
/usr/local/bin/obsidian command id=editor:toggle-bold
/usr/local/bin/obsidian command id=editor:toggle-italics
/usr/local/bin/obsidian command id=editor:toggle-strikethrough
/usr/local/bin/obsidian command id=editor:toggle-highlight
/usr/local/bin/obsidian command id=editor:toggle-code
/usr/local/bin/obsidian command id=editor:toggle-inline-math
/usr/local/bin/obsidian command id=editor:toggle-blockquote
/usr/local/bin/obsidian command id=editor:toggle-bullet-list
/usr/local/bin/obsidian command id=editor:toggle-numbered-list
/usr/local/bin/obsidian command id=editor:toggle-checklist-status
/usr/local/bin/obsidian command id=editor:cycle-list-checklist
/usr/local/bin/obsidian command id=editor:insert-callout
/usr/local/bin/obsidian command id=editor:insert-codeblock
/usr/local/bin/obsidian command id=editor:insert-table
/usr/local/bin/obsidian command id=editor:insert-link
/usr/local/bin/obsidian command id=editor:insert-wikilink
/usr/local/bin/obsidian command id=editor:insert-embed
/usr/local/bin/obsidian command id=editor:insert-tag
/usr/local/bin/obsidian command id=editor:insert-footnote
/usr/local/bin/obsidian command id=editor:insert-horizontal-rule
/usr/local/bin/obsidian command id=editor:insert-mathblock
/usr/local/bin/obsidian command id=editor:set-heading-1        # through heading-6
/usr/local/bin/obsidian command id=editor:set-heading-0        # remove heading
/usr/local/bin/obsidian command id=editor:clear-formatting
/usr/local/bin/obsidian command id=editor:toggle-source        # toggle source mode
/usr/local/bin/obsidian command id=editor:toggle-fold-properties
/usr/local/bin/obsidian command id=editor:toggle-spellcheck
/usr/local/bin/obsidian command id=editor:toggle-readable-line-length
/usr/local/bin/obsidian command id=editor:toggle-line-numbers
```

### Table Editing

```
/usr/local/bin/obsidian command id=editor:table-row-before
/usr/local/bin/obsidian command id=editor:table-row-after
/usr/local/bin/obsidian command id=editor:table-row-up
/usr/local/bin/obsidian command id=editor:table-row-down
/usr/local/bin/obsidian command id=editor:table-row-copy
/usr/local/bin/obsidian command id=editor:table-row-delete
/usr/local/bin/obsidian command id=editor:table-col-before
/usr/local/bin/obsidian command id=editor:table-col-after
/usr/local/bin/obsidian command id=editor:table-col-left
/usr/local/bin/obsidian command id=editor:table-col-right
/usr/local/bin/obsidian command id=editor:table-col-copy
/usr/local/bin/obsidian command id=editor:table-col-delete
/usr/local/bin/obsidian command id=editor:table-col-align-left
/usr/local/bin/obsidian command id=editor:table-col-align-center
/usr/local/bin/obsidian command id=editor:table-col-align-right
```

### Multi-Cursor and Navigation

```
/usr/local/bin/obsidian command id=editor:add-cursor-above
/usr/local/bin/obsidian command id=editor:add-cursor-below
/usr/local/bin/obsidian command id=editor:swap-line-up
/usr/local/bin/obsidian command id=editor:swap-line-down
/usr/local/bin/obsidian command id=editor:delete-paragraph
/usr/local/bin/obsidian command id=editor:indent-list
/usr/local/bin/obsidian command id=editor:unindent-list
/usr/local/bin/obsidian command id=editor:fold-all
/usr/local/bin/obsidian command id=editor:unfold-all
/usr/local/bin/obsidian command id=editor:fold-more
/usr/local/bin/obsidian command id=editor:fold-less
/usr/local/bin/obsidian command id=editor:toggle-fold
/usr/local/bin/obsidian command id=editor:focus
/usr/local/bin/obsidian command id=editor:focus-top
/usr/local/bin/obsidian command id=editor:focus-bottom
/usr/local/bin/obsidian command id=editor:focus-left
/usr/local/bin/obsidian command id=editor:focus-right
```
