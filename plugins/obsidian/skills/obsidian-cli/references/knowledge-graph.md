# Knowledge Graph

Reference for link analysis, tags, properties, aliases, and document structure. Based on Obsidian
CLI v1.12.4.

## Table of Contents

- [Backlinks](#backlinks)
- [Outgoing Links](#outgoing-links)
- [Orphans and Dead-Ends](#orphans-and-dead-ends)
- [Unresolved Links](#unresolved-links)
- [Tags](#tags)
- [Properties (Frontmatter)](#properties-frontmatter)
- [Aliases](#aliases)
- [Outline (Headings)](#outline-headings)
- [Graph View](#graph-view)

## Backlinks

Files that link TO a given file:

```
/usr/local/bin/obsidian backlinks file="Topic"                 # list backlinks
/usr/local/bin/obsidian backlinks file="Topic" counts          # include link counts
/usr/local/bin/obsidian backlinks file="Topic" total           # backlink count
/usr/local/bin/obsidian backlinks file="Topic" format=json     # JSON output
```

## Outgoing Links

Links FROM a given file:

```
/usr/local/bin/obsidian links file="Note"              # list outgoing links
/usr/local/bin/obsidian links file="Note" total        # link count
```

## Orphans and Dead-Ends

Orphans have no incoming links. Dead-ends have no outgoing links:

```
/usr/local/bin/obsidian orphans                        # files nobody links to
/usr/local/bin/obsidian orphans total                  # orphan count
/usr/local/bin/obsidian orphans all                    # include non-markdown files

/usr/local/bin/obsidian deadends                       # files with no outgoing links
/usr/local/bin/obsidian deadends total                 # dead-end count
/usr/local/bin/obsidian deadends all                   # include non-markdown files
```

## Unresolved Links

Wikilinks that point to files that don't exist:

```
/usr/local/bin/obsidian unresolved                     # list unresolved links
/usr/local/bin/obsidian unresolved total               # count
/usr/local/bin/obsidian unresolved counts              # include link counts
/usr/local/bin/obsidian unresolved verbose             # include source files
/usr/local/bin/obsidian unresolved format=json         # JSON output
```

## Tags

```
/usr/local/bin/obsidian tags                           # list all tags
/usr/local/bin/obsidian tags counts                    # include occurrence counts
/usr/local/bin/obsidian tags sort=count                # sort by frequency
/usr/local/bin/obsidian tags total                     # tag count
/usr/local/bin/obsidian tags format=json               # JSON output

/usr/local/bin/obsidian tags file="Note"               # tags in specific file
/usr/local/bin/obsidian tags path="folder/note.md"     # tags by path
/usr/local/bin/obsidian tags active                    # tags for active file

/usr/local/bin/obsidian tag name="project"             # info for specific tag
/usr/local/bin/obsidian tag name="project" total       # occurrence count
/usr/local/bin/obsidian tag name="project" verbose     # include file list
```

## Properties (Frontmatter)

### Listing Properties

```
/usr/local/bin/obsidian properties                     # all properties in vault
/usr/local/bin/obsidian properties counts              # with occurrence counts
/usr/local/bin/obsidian properties sort=count          # sort by frequency
/usr/local/bin/obsidian properties total               # property count
/usr/local/bin/obsidian properties format=json         # JSON output
/usr/local/bin/obsidian properties name="status"       # specific property count

/usr/local/bin/obsidian properties file="Note"         # properties for file
/usr/local/bin/obsidian properties active              # properties for active file
```

### Reading a Property

```
/usr/local/bin/obsidian property:read name="status" file="Task"
/usr/local/bin/obsidian property:read name="tags" path="Projects/idea.md"
```

### Setting a Property

```
/usr/local/bin/obsidian property:set name="status" value="done" file="Task"
/usr/local/bin/obsidian property:set name="priority" value="1" type=number file="Task"
/usr/local/bin/obsidian property:set name="reviewed" value="true" type=checkbox file="Note"
/usr/local/bin/obsidian property:set name="due" value="2025-03-01" type=date file="Task"
```

Supported types: `text`, `list`, `number`, `checkbox`, `date`, `datetime`

### Removing a Property

```
/usr/local/bin/obsidian property:remove name="status" file="Task"
```

## Aliases

```
/usr/local/bin/obsidian aliases                        # all aliases in vault
/usr/local/bin/obsidian aliases file="Note"            # aliases for file
/usr/local/bin/obsidian aliases active                 # aliases for active file
/usr/local/bin/obsidian aliases total                  # alias count
/usr/local/bin/obsidian aliases verbose                # include file paths
```

## Outline (Headings)

```
/usr/local/bin/obsidian outline                        # headings for active file
/usr/local/bin/obsidian outline file="Note"            # headings for specific file
/usr/local/bin/obsidian outline format=tree            # tree format (default)
/usr/local/bin/obsidian outline format=md              # markdown format
/usr/local/bin/obsidian outline format=json            # JSON format
/usr/local/bin/obsidian outline total                  # heading count
```

## Graph View

Open graph views via commands:

```
/usr/local/bin/obsidian command id=graph:open          # open global graph
/usr/local/bin/obsidian command id=graph:open-local    # open local graph
/usr/local/bin/obsidian command id=graph:animate       # animate graph
```
