# Daily Notes and Templates

Reference for daily note operations, templates, and bookmarks. Based on Obsidian CLI v1.12.4.

## Table of Contents

- [Daily Notes](#daily-notes)
- [Templates](#templates)
- [Bookmarks](#bookmarks)

## Daily Notes

### Open Daily Note

```
/usr/local/bin/obsidian daily                          # open today's daily note
/usr/local/bin/obsidian daily paneType=tab             # open in new tab
/usr/local/bin/obsidian daily paneType=split           # open in split
/usr/local/bin/obsidian daily paneType=window          # open in new window
```

### Read Daily Note

```
/usr/local/bin/obsidian daily:read                     # read today's daily note content
/usr/local/bin/obsidian daily:path                     # get daily note file path
```

### Append to Daily Note

```
/usr/local/bin/obsidian daily:append content="Meeting at 3pm"
/usr/local/bin/obsidian daily:append content=" (confirmed)" inline    # no newline
/usr/local/bin/obsidian daily:append content="Update" open            # open after
/usr/local/bin/obsidian daily:append content="Update" open paneType=tab
```

### Prepend to Daily Note

```
/usr/local/bin/obsidian daily:prepend content="Morning standup notes"
/usr/local/bin/obsidian daily:prepend content="URGENT: " inline       # no newline
/usr/local/bin/obsidian daily:prepend content="Item" open paneType=split
```

### Navigate Daily Notes

```
/usr/local/bin/obsidian command id=daily-notes              # open daily note (command)
/usr/local/bin/obsidian command id=daily-notes:goto-next    # next daily note
/usr/local/bin/obsidian command id=daily-notes:goto-prev    # previous daily note
```

## Templates

### List Templates

```
/usr/local/bin/obsidian templates                      # list all templates
/usr/local/bin/obsidian templates total                # template count
```

### Insert Template

```
/usr/local/bin/obsidian template:insert name="Meeting"         # insert into active file
```

### Read Template Content

```
/usr/local/bin/obsidian template:read name="Meeting"           # raw template content
/usr/local/bin/obsidian template:read name="Meeting" resolve   # resolve variables
/usr/local/bin/obsidian template:read name="Meeting" resolve title="Q1 Review"  # with title
```

### Create from Template

```
/usr/local/bin/obsidian create name="Standup 2025-03-01" template="Meeting"
/usr/local/bin/obsidian create name="Project X" template="Project" open
```

## Bookmarks

### Add Bookmarks

```
/usr/local/bin/obsidian bookmark file="Projects/idea.md"                    # bookmark a file
/usr/local/bin/obsidian bookmark file="Note.md" subpath="heading"           # bookmark a heading
/usr/local/bin/obsidian bookmark file="Note.md" subpath="^block-id"         # bookmark a block
/usr/local/bin/obsidian bookmark folder="Projects"                          # bookmark a folder
/usr/local/bin/obsidian bookmark search="tag:#important"                    # bookmark a search
/usr/local/bin/obsidian bookmark url="https://example.com" title="Example"  # bookmark a URL
```

### List Bookmarks

```
/usr/local/bin/obsidian bookmarks                      # list all bookmarks
/usr/local/bin/obsidian bookmarks total                # bookmark count
/usr/local/bin/obsidian bookmarks verbose              # include types
/usr/local/bin/obsidian bookmarks format=json          # JSON output
```

### Bookmark Commands

```
/usr/local/bin/obsidian command id=bookmarks:open                      # open bookmarks pane
/usr/local/bin/obsidian command id=bookmarks:bookmark-current-view     # bookmark current view
/usr/local/bin/obsidian command id=bookmarks:bookmark-current-heading  # bookmark heading
/usr/local/bin/obsidian command id=bookmarks:bookmark-all-tabs         # bookmark all tabs
/usr/local/bin/obsidian command id=bookmarks:unbookmark-current-view   # remove bookmark
```
