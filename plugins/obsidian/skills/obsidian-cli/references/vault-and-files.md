# Vault and Files

Reference for vault info, file/folder management, and search. Based on Obsidian CLI v1.12.4.

## Table of Contents

- [Vault Info](#vault-info)
- [File Operations](#file-operations)
- [Folder Operations](#folder-operations)
- [Search](#search)
- [Word Count](#word-count)
- [App Control](#app-control)

## Vault Info

```
obsidian vault                          # full vault info
obsidian vault info=name                # vault name only
obsidian vault info=path                # vault path only
obsidian vault info=files               # file count
obsidian vault info=folders             # folder count
obsidian vault info=size                # vault size

obsidian vaults                         # list known vaults
obsidian vaults verbose                 # include vault paths
obsidian vaults total                   # vault count
```

## File Operations

### Listing Files

```
obsidian files                          # all files in vault
obsidian files folder="Projects"        # files in folder
obsidian files ext=md                   # filter by extension
obsidian files total                    # file count
```

### Reading

```
obsidian read file="My Note"            # read by name
obsidian read path="folder/note.md"     # read by exact path
```

### Creating

```
obsidian create name="New Note"                          # empty note
obsidian create name="New Note" content="# Title\nBody"  # with content
obsidian create path="Projects/idea.md" content="text"   # specific path
obsidian create name="From Template" template="Meeting"  # from template
obsidian create name="Note" overwrite                    # overwrite existing
obsidian create name="Note" open                         # open after creating
obsidian create name="Note" open newtab                  # open in new tab
```

### Appending and Prepending

```
obsidian append file="Log" content="New entry"           # append with newline
obsidian append file="Log" content=" more" inline        # append without newline
obsidian prepend file="Log" content="Top entry"          # prepend with newline
obsidian prepend file="Log" content="prefix" inline      # prepend without newline
```

### File Info

```
obsidian file file="Note"               # file metadata
obsidian file path="folder/note.md"     # by exact path
```

### Moving and Renaming

```
obsidian move file="Note" to="Archive"                   # move to folder
obsidian move file="Note" to="Archive/old-note.md"       # move and rename
obsidian rename file="Old Name" name="New Name"          # rename in place
```

### Deleting

```
obsidian delete file="Note"             # move to trash
obsidian delete file="Note" permanent   # skip trash, delete permanently
```

### Recently Opened

```
obsidian recents                        # recently opened files
obsidian recents total                  # count of recent files
```

## Folder Operations

```
obsidian folders                        # list all folders
obsidian folders folder="Projects"      # subfolders of a folder
obsidian folders total                  # folder count

obsidian folder path="Projects"         # folder info
obsidian folder path="Projects" info=files    # file count in folder
obsidian folder path="Projects" info=folders  # subfolder count
obsidian folder path="Projects" info=size     # folder size
```

## Search

### Basic Search

```
obsidian search query="meeting agenda"                   # search vault
obsidian search query="TODO" path="Projects"             # limit to folder
obsidian search query="API" limit=5                      # max 5 results
obsidian search query="Config" case                      # case sensitive
obsidian search query="bug" total                        # match count only
obsidian search query="data" format=json                 # JSON output
```

### Search with Context

Returns matching lines with surrounding context:

```
obsidian search:context query="error"                    # with line context
obsidian search:context query="fix" path="Notes" format=json
```

### Open Search in UI

```
obsidian search:open query="my search"                   # opens search pane
```

## Word Count

```
obsidian wordcount file="Essay"         # words and characters
obsidian wordcount file="Essay" words   # word count only
obsidian wordcount file="Essay" characters  # character count only
```

## App Control

```
obsidian reload                         # reload vault
obsidian restart                        # restart app
obsidian version                        # show version
```
