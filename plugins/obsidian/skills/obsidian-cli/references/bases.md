# Bases

Reference for Obsidian Bases - structured data views over vault content. Based on Obsidian CLI
v1.12.4.

Bases are Obsidian's way of working with structured/tabular data across notes - similar to a
database view over your vault.

## List Bases

```
obsidian bases                          # list all base files in vault
```

## Query a Base

```
obsidian base:query file="Tasks"                        # query default view
obsidian base:query file="Tasks" view="Kanban"          # query specific view
obsidian base:query path="Bases/projects.md"             # by path
obsidian base:query file="Tasks" format=json            # JSON (default)
obsidian base:query file="Tasks" format=csv             # CSV
obsidian base:query file="Tasks" format=tsv             # TSV
obsidian base:query file="Tasks" format=md              # Markdown table
obsidian base:query file="Tasks" format=paths           # file paths only
```

## List Views

```
obsidian base:views file="Tasks"        # list views in a base
```

## Create Items

```
obsidian base:create file="Tasks" name="New Task"
obsidian base:create file="Tasks" name="Task" content="## Details\nSome content"
obsidian base:create file="Tasks" view="Backlog" name="Item"
obsidian base:create file="Tasks" name="Task" open          # open after creating
obsidian base:create file="Tasks" name="Task" open newtab   # open in new tab
```

## Base Commands

```
obsidian command id=bases:new-file      # create new base file
obsidian command id=bases:insert        # insert base
obsidian command id=bases:add-item      # add item to base
obsidian command id=bases:add-view      # add view to base
obsidian command id=bases:change-view   # change base view
obsidian command id=bases:copy-table    # copy table to clipboard
```
