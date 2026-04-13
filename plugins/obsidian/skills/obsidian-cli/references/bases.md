# Bases

Reference for Obsidian Bases - structured data views over vault content. Based on Obsidian CLI
v1.12.4.

Bases are Obsidian's way of working with structured/tabular data across notes - similar to a
database view over your vault.

## List Bases

```
/usr/local/bin/obsidian bases                          # list all base files in vault
```

## Query a Base

```
/usr/local/bin/obsidian base:query file="Tasks"                        # query default view
/usr/local/bin/obsidian base:query file="Tasks" view="Kanban"          # query specific view
/usr/local/bin/obsidian base:query path="Bases/projects.md"             # by path
/usr/local/bin/obsidian base:query file="Tasks" format=json            # JSON (default)
/usr/local/bin/obsidian base:query file="Tasks" format=csv             # CSV
/usr/local/bin/obsidian base:query file="Tasks" format=tsv             # TSV
/usr/local/bin/obsidian base:query file="Tasks" format=md              # Markdown table
/usr/local/bin/obsidian base:query file="Tasks" format=paths           # file paths only
```

## List Views

```
/usr/local/bin/obsidian base:views file="Tasks"        # list views in a base
```

## Create Items

```
/usr/local/bin/obsidian base:create file="Tasks" name="New Task"
/usr/local/bin/obsidian base:create file="Tasks" name="Task" content="## Details\nSome content"
/usr/local/bin/obsidian base:create file="Tasks" view="Backlog" name="Item"
/usr/local/bin/obsidian base:create file="Tasks" name="Task" open          # open after creating
/usr/local/bin/obsidian base:create file="Tasks" name="Task" open newtab   # open in new tab
```

## Base Commands

```
/usr/local/bin/obsidian command id=bases:new-file      # create new base file
/usr/local/bin/obsidian command id=bases:insert        # insert base
/usr/local/bin/obsidian command id=bases:add-item      # add item to base
/usr/local/bin/obsidian command id=bases:add-view      # add view to base
/usr/local/bin/obsidian command id=bases:change-view   # change base view
/usr/local/bin/obsidian command id=bases:copy-table    # copy table to clipboard
```
