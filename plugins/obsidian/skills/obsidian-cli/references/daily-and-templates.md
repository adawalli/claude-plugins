# Daily Notes and Templates

Reference for daily note operations, templates, and bookmarks. Based on Obsidian CLI v1.12.4.

## Table of Contents

- [Daily Notes](#daily-notes)
- [Templates](#templates)
- [Bookmarks](#bookmarks)

## Daily Notes

### Open Daily Note

```
obsidian daily                          # open today's daily note
obsidian daily paneType=tab             # open in new tab
obsidian daily paneType=split           # open in split
obsidian daily paneType=window          # open in new window
```

### Read Daily Note

```
obsidian daily:read                     # read today's daily note content
obsidian daily:path                     # get daily note file path
```

### Append to Daily Note

```
obsidian daily:append content="Meeting at 3pm"
obsidian daily:append content=" (confirmed)" inline    # no newline
obsidian daily:append content="Update" open            # open after
obsidian daily:append content="Update" open paneType=tab
```

### Prepend to Daily Note

```
obsidian daily:prepend content="Morning standup notes"
obsidian daily:prepend content="URGENT: " inline       # no newline
obsidian daily:prepend content="Item" open paneType=split
```

### Navigate Daily Notes

```
obsidian command id=daily-notes              # open daily note (command)
obsidian command id=daily-notes:goto-next    # next daily note
obsidian command id=daily-notes:goto-prev    # previous daily note
```

## Templates

### List Templates

```
obsidian templates                      # list all templates
obsidian templates total                # template count
```

### Insert Template

```
obsidian template:insert name="Meeting"         # insert into active file
```

### Read Template Content

```
obsidian template:read name="Meeting"           # raw template content
obsidian template:read name="Meeting" resolve   # resolve variables
obsidian template:read name="Meeting" resolve title="Q1 Review"  # with title
```

### Create from Template

```
obsidian create name="Standup 2025-03-01" template="Meeting"
obsidian create name="Project X" template="Project" open
```

## Bookmarks

### Add Bookmarks

```
obsidian bookmark file="Projects/idea.md"                    # bookmark a file
obsidian bookmark file="Note.md" subpath="heading"           # bookmark a heading
obsidian bookmark file="Note.md" subpath="^block-id"         # bookmark a block
obsidian bookmark folder="Projects"                          # bookmark a folder
obsidian bookmark search="tag:#important"                    # bookmark a search
obsidian bookmark url="https://example.com" title="Example"  # bookmark a URL
```

### List Bookmarks

```
obsidian bookmarks                      # list all bookmarks
obsidian bookmarks total                # bookmark count
obsidian bookmarks verbose              # include types
obsidian bookmarks format=json          # JSON output
```

### Bookmark Commands

```
obsidian command id=bookmarks:open                      # open bookmarks pane
obsidian command id=bookmarks:bookmark-current-view     # bookmark current view
obsidian command id=bookmarks:bookmark-current-heading  # bookmark heading
obsidian command id=bookmarks:bookmark-all-tabs         # bookmark all tabs
obsidian command id=bookmarks:unbookmark-current-view   # remove bookmark
```
