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
obsidian workspace                      # show workspace tree
obsidian workspace ids                  # include workspace item IDs
```

### Workspace Commands

```
obsidian command id=workspace:new-tab               # new tab
obsidian command id=workspace:new-window             # new window
obsidian command id=workspace:close                  # close current tab
obsidian command id=workspace:close-others           # close other tabs
obsidian command id=workspace:close-others-tab-group # close others in group
obsidian command id=workspace:close-tab-group        # close tab group
obsidian command id=workspace:close-window           # close window
obsidian command id=workspace:split-horizontal       # horizontal split
obsidian command id=workspace:split-vertical         # vertical split
obsidian command id=workspace:toggle-pin             # pin/unpin tab
obsidian command id=workspace:toggle-stacked-tabs    # toggle stacked tabs
obsidian command id=workspace:undo-close-pane        # reopen closed tab
obsidian command id=workspace:move-to-new-window     # move to new window
obsidian command id=workspace:open-in-new-window     # open in new window
```

### Navigate Tabs

```
obsidian command id=workspace:next-tab              # next tab
obsidian command id=workspace:previous-tab          # previous tab
obsidian command id=workspace:goto-tab-1            # go to tab 1-8
obsidian command id=workspace:goto-last-tab         # go to last tab
```

### Copy Paths

```
obsidian command id=workspace:copy-path             # copy relative path
obsidian command id=workspace:copy-full-path        # copy full path
obsidian command id=workspace:copy-url              # copy obsidian:// URL
```

### Export

```
obsidian command id=workspace:export-pdf            # export as PDF
```

## Tabs

```
obsidian tabs                           # list open tabs
obsidian tabs ids                       # include tab IDs

obsidian tab:open                       # open new tab
obsidian tab:open file="Note.md"        # open file in tab
obsidian tab:open group=<id>            # open in specific group
obsidian tab:open view=<type>           # open specific view type
```

## Commands

### Execute a Command

```
obsidian command id=editor:toggle-bold  # execute by command ID
```

### Discover Commands

```
obsidian commands                       # list all 210+ command IDs
obsidian commands filter=editor         # filter by prefix
obsidian commands filter=workspace      # workspace commands
obsidian commands filter=app            # app commands
obsidian commands filter=file-explorer  # file explorer commands
```

Common command prefixes: `app:`, `editor:`, `workspace:`, `file-explorer:`, `graph:`, `bookmarks:`,
`backlink:`, `outline:`, `sync:`, `markdown:`, `note-composer:`, `bases:`.

## Hotkeys

```
obsidian hotkeys                        # list bound hotkeys
obsidian hotkeys all                    # include commands without hotkeys
obsidian hotkeys total                  # hotkey count
obsidian hotkeys verbose                # show if custom or default
obsidian hotkeys format=json            # JSON output

obsidian hotkey id=editor:toggle-bold   # hotkey for specific command
obsidian hotkey id=editor:toggle-bold verbose  # show custom vs default
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
obsidian command id=app:go-back                 # navigate back
obsidian command id=app:go-forward              # navigate forward
obsidian command id=app:toggle-left-sidebar     # toggle left sidebar
obsidian command id=app:toggle-right-sidebar    # toggle right sidebar
obsidian command id=app:toggle-ribbon           # toggle ribbon
obsidian command id=window:zoom-in              # zoom in
obsidian command id=window:zoom-out             # zoom out
obsidian command id=window:reset-zoom           # reset zoom
obsidian command id=window:toggle-always-on-top # always on top
```

### Open Views

```
obsidian command id=file-explorer:open          # file explorer
obsidian command id=global-search:open          # search
obsidian command id=graph:open                  # graph view
obsidian command id=graph:open-local            # local graph
obsidian command id=outline:open                # outline
obsidian command id=tag-pane:open               # tag pane
obsidian command id=backlink:open               # backlinks
obsidian command id=outgoing-links:open         # outgoing links
obsidian command id=properties:open             # global properties
obsidian command id=properties:open-local       # local properties
obsidian command id=bookmarks:open              # bookmarks
```

## Editor Commands

Formatting and editing via command IDs:

```
obsidian command id=editor:toggle-bold
obsidian command id=editor:toggle-italics
obsidian command id=editor:toggle-strikethrough
obsidian command id=editor:toggle-highlight
obsidian command id=editor:toggle-code
obsidian command id=editor:toggle-inline-math
obsidian command id=editor:toggle-blockquote
obsidian command id=editor:toggle-bullet-list
obsidian command id=editor:toggle-numbered-list
obsidian command id=editor:toggle-checklist-status
obsidian command id=editor:cycle-list-checklist
obsidian command id=editor:insert-callout
obsidian command id=editor:insert-codeblock
obsidian command id=editor:insert-table
obsidian command id=editor:insert-link
obsidian command id=editor:insert-wikilink
obsidian command id=editor:insert-embed
obsidian command id=editor:insert-tag
obsidian command id=editor:insert-footnote
obsidian command id=editor:insert-horizontal-rule
obsidian command id=editor:insert-mathblock
obsidian command id=editor:set-heading-1        # through heading-6
obsidian command id=editor:set-heading-0        # remove heading
obsidian command id=editor:clear-formatting
obsidian command id=editor:toggle-source        # toggle source mode
obsidian command id=editor:toggle-fold-properties
obsidian command id=editor:toggle-spellcheck
obsidian command id=editor:toggle-readable-line-length
obsidian command id=editor:toggle-line-numbers
```

### Table Editing

```
obsidian command id=editor:table-row-before
obsidian command id=editor:table-row-after
obsidian command id=editor:table-row-up
obsidian command id=editor:table-row-down
obsidian command id=editor:table-row-copy
obsidian command id=editor:table-row-delete
obsidian command id=editor:table-col-before
obsidian command id=editor:table-col-after
obsidian command id=editor:table-col-left
obsidian command id=editor:table-col-right
obsidian command id=editor:table-col-copy
obsidian command id=editor:table-col-delete
obsidian command id=editor:table-col-align-left
obsidian command id=editor:table-col-align-center
obsidian command id=editor:table-col-align-right
```

### Multi-Cursor and Navigation

```
obsidian command id=editor:add-cursor-above
obsidian command id=editor:add-cursor-below
obsidian command id=editor:swap-line-up
obsidian command id=editor:swap-line-down
obsidian command id=editor:delete-paragraph
obsidian command id=editor:indent-list
obsidian command id=editor:unindent-list
obsidian command id=editor:fold-all
obsidian command id=editor:unfold-all
obsidian command id=editor:fold-more
obsidian command id=editor:fold-less
obsidian command id=editor:toggle-fold
obsidian command id=editor:focus
obsidian command id=editor:focus-top
obsidian command id=editor:focus-bottom
obsidian command id=editor:focus-left
obsidian command id=editor:focus-right
```
