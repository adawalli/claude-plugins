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
obsidian backlinks file="Topic"                 # list backlinks
obsidian backlinks file="Topic" counts          # include link counts
obsidian backlinks file="Topic" total           # backlink count
obsidian backlinks file="Topic" format=json     # JSON output
```

## Outgoing Links

Links FROM a given file:

```
obsidian links file="Note"              # list outgoing links
obsidian links file="Note" total        # link count
```

## Orphans and Dead-Ends

Orphans have no incoming links. Dead-ends have no outgoing links:

```
obsidian orphans                        # files nobody links to
obsidian orphans total                  # orphan count
obsidian orphans all                    # include non-markdown files

obsidian deadends                       # files with no outgoing links
obsidian deadends total                 # dead-end count
obsidian deadends all                   # include non-markdown files
```

## Unresolved Links

Wikilinks that point to files that don't exist:

```
obsidian unresolved                     # list unresolved links
obsidian unresolved total               # count
obsidian unresolved counts              # include link counts
obsidian unresolved verbose             # include source files
obsidian unresolved format=json         # JSON output
```

## Tags

```
obsidian tags                           # list all tags
obsidian tags counts                    # include occurrence counts
obsidian tags sort=count                # sort by frequency
obsidian tags total                     # tag count
obsidian tags format=json               # JSON output

obsidian tags file="Note"               # tags in specific file
obsidian tags path="folder/note.md"     # tags by path
obsidian tags active                    # tags for active file

obsidian tag name="project"             # info for specific tag
obsidian tag name="project" total       # occurrence count
obsidian tag name="project" verbose     # include file list
```

## Properties (Frontmatter)

### Listing Properties

```
obsidian properties                     # all properties in vault
obsidian properties counts              # with occurrence counts
obsidian properties sort=count          # sort by frequency
obsidian properties total               # property count
obsidian properties format=json         # JSON output
obsidian properties name="status"       # specific property count

obsidian properties file="Note"         # properties for file
obsidian properties active              # properties for active file
```

### Reading a Property

```
obsidian property:read name="status" file="Task"
obsidian property:read name="tags" path="Projects/idea.md"
```

### Setting a Property

```
obsidian property:set name="status" value="done" file="Task"
obsidian property:set name="priority" value="1" type=number file="Task"
obsidian property:set name="reviewed" value="true" type=checkbox file="Note"
obsidian property:set name="due" value="2025-03-01" type=date file="Task"
```

Supported types: `text`, `list`, `number`, `checkbox`, `date`, `datetime`

### Removing a Property

```
obsidian property:remove name="status" file="Task"
```

## Aliases

```
obsidian aliases                        # all aliases in vault
obsidian aliases file="Note"            # aliases for file
obsidian aliases active                 # aliases for active file
obsidian aliases total                  # alias count
obsidian aliases verbose                # include file paths
```

## Outline (Headings)

```
obsidian outline                        # headings for active file
obsidian outline file="Note"            # headings for specific file
obsidian outline format=tree            # tree format (default)
obsidian outline format=md              # markdown format
obsidian outline format=json            # JSON format
obsidian outline total                  # heading count
```

## Graph View

Open graph views via commands:

```
obsidian command id=graph:open          # open global graph
obsidian command id=graph:open-local    # open local graph
obsidian command id=graph:animate       # animate graph
```
