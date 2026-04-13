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
/usr/local/bin/obsidian vault                          # full vault info
/usr/local/bin/obsidian vault info=name                # vault name only
/usr/local/bin/obsidian vault info=path                # vault path only
/usr/local/bin/obsidian vault info=files               # file count
/usr/local/bin/obsidian vault info=folders             # folder count
/usr/local/bin/obsidian vault info=size                # vault size

/usr/local/bin/obsidian vaults                         # list known vaults
/usr/local/bin/obsidian vaults verbose                 # include vault paths
/usr/local/bin/obsidian vaults total                   # vault count
```

## File Operations

### Listing Files

```
/usr/local/bin/obsidian files                          # all files in vault
/usr/local/bin/obsidian files folder="Projects"        # files in folder
/usr/local/bin/obsidian files ext=md                   # filter by extension
/usr/local/bin/obsidian files total                    # file count
```

### Reading

```
/usr/local/bin/obsidian read file="My Note"            # read by name
/usr/local/bin/obsidian read path="folder/note.md"     # read by exact path
```

### Creating

```
/usr/local/bin/obsidian create name="New Note"                          # empty note
/usr/local/bin/obsidian create name="New Note" content="# Title\nBody"  # with content
/usr/local/bin/obsidian create path="Projects/idea.md" content="text"   # specific path
/usr/local/bin/obsidian create name="From Template" template="Meeting"  # from template
/usr/local/bin/obsidian create name="Note" overwrite                    # overwrite existing
/usr/local/bin/obsidian create name="Note" open                         # open after creating
/usr/local/bin/obsidian create name="Note" open newtab                  # open in new tab
```

### Appending and Prepending

```
/usr/local/bin/obsidian append file="Log" content="New entry"           # append with newline
/usr/local/bin/obsidian append file="Log" content=" more" inline        # append without newline
/usr/local/bin/obsidian prepend file="Log" content="Top entry"          # prepend with newline
/usr/local/bin/obsidian prepend file="Log" content="prefix" inline      # prepend without newline
```

### File Info

```
/usr/local/bin/obsidian file file="Note"               # file metadata
/usr/local/bin/obsidian file path="folder/note.md"     # by exact path
```

### Moving and Renaming

```
/usr/local/bin/obsidian move file="Note" to="Archive"                   # move to folder
/usr/local/bin/obsidian move file="Note" to="Archive/old-note.md"       # move and rename
/usr/local/bin/obsidian rename file="Old Name" name="New Name"          # rename in place
```

### Deleting

```
/usr/local/bin/obsidian delete file="Note"             # move to trash
/usr/local/bin/obsidian delete file="Note" permanent   # skip trash, delete permanently
```

### Recently Opened

```
/usr/local/bin/obsidian recents                        # recently opened files
/usr/local/bin/obsidian recents total                  # count of recent files
```

## Folder Operations

```
/usr/local/bin/obsidian folders                        # list all folders
/usr/local/bin/obsidian folders folder="Projects"      # subfolders of a folder
/usr/local/bin/obsidian folders total                  # folder count

/usr/local/bin/obsidian folder path="Projects"         # folder info
/usr/local/bin/obsidian folder path="Projects" info=files    # file count in folder
/usr/local/bin/obsidian folder path="Projects" info=folders  # subfolder count
/usr/local/bin/obsidian folder path="Projects" info=size     # folder size
```

## Search

### Basic Search

```
/usr/local/bin/obsidian search query="meeting agenda"                   # search vault
/usr/local/bin/obsidian search query="TODO" path="Projects"             # limit to folder
/usr/local/bin/obsidian search query="API" limit=5                      # max 5 results
/usr/local/bin/obsidian search query="Config" case                      # case sensitive
/usr/local/bin/obsidian search query="bug" total                        # match count only
/usr/local/bin/obsidian search query="data" format=json                 # JSON output
```

### Search with Context

Returns matching lines with surrounding context:

```
/usr/local/bin/obsidian search:context query="error"                    # with line context
/usr/local/bin/obsidian search:context query="fix" path="Notes" format=json
```

### Open Search in UI

```
/usr/local/bin/obsidian search:open query="my search"                   # opens search pane
```

## Word Count

```
/usr/local/bin/obsidian wordcount file="Essay"         # words and characters
/usr/local/bin/obsidian wordcount file="Essay" words   # word count only
/usr/local/bin/obsidian wordcount file="Essay" characters  # character count only
```

## App Control

```
/usr/local/bin/obsidian reload                         # reload vault
/usr/local/bin/obsidian restart                        # restart app
/usr/local/bin/obsidian version                        # show version
```
