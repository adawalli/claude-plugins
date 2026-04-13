# Developer Tools

Reference for Obsidian developer and debugging tools. Based on Obsidian CLI v1.12.4.

These tools are useful for Obsidian plugin development, debugging, and advanced automation.

## Table of Contents

- [JavaScript Eval](#javascript-eval)
- [DOM Inspection](#dom-inspection)
- [CSS Inspection](#css-inspection)
- [Console and Errors](#console-and-errors)
- [Chrome DevTools Protocol](#chrome-devtools-protocol)
- [Screenshots](#screenshots)
- [DevTools and Mobile](#devtools-and-mobile)

## JavaScript Eval

Execute arbitrary JavaScript in the Obsidian context:

```
/usr/local/bin/obsidian eval code="app.vault.getName()"
/usr/local/bin/obsidian eval code="app.workspace.getActiveFile()?.path"
/usr/local/bin/obsidian eval code="Object.keys(app.plugins.plugins)"
/usr/local/bin/obsidian eval code="app.vault.getMarkdownFiles().length"
```

Access the full Obsidian API via the `app` global. Useful for operations not covered by CLI
commands.

## DOM Inspection

Query and inspect DOM elements:

```
/usr/local/bin/obsidian dev:dom selector=".workspace-leaf"             # first match outerHTML
/usr/local/bin/obsidian dev:dom selector=".workspace-leaf" all         # all matches
/usr/local/bin/obsidian dev:dom selector=".workspace-leaf" text        # text content
/usr/local/bin/obsidian dev:dom selector=".workspace-leaf" inner       # innerHTML
/usr/local/bin/obsidian dev:dom selector=".workspace-leaf" total       # element count
/usr/local/bin/obsidian dev:dom selector=".nav-file-title" attr=data-path  # attribute value
/usr/local/bin/obsidian dev:dom selector=".view-header" css=background     # CSS property value
```

## CSS Inspection

Inspect computed CSS with source locations:

```
/usr/local/bin/obsidian dev:css selector=".workspace-leaf"             # all CSS for selector
/usr/local/bin/obsidian dev:css selector=".workspace-leaf" prop=background  # specific property
```

## Console and Errors

Capture and view console output:

```
/usr/local/bin/obsidian dev:console                    # show recent console messages
/usr/local/bin/obsidian dev:console limit=20           # last 20 messages
/usr/local/bin/obsidian dev:console level=error        # errors only
/usr/local/bin/obsidian dev:console level=warn         # warnings only
/usr/local/bin/obsidian dev:console level=log          # logs only
/usr/local/bin/obsidian dev:console level=info         # info only
/usr/local/bin/obsidian dev:console level=debug        # debug only
/usr/local/bin/obsidian dev:console clear              # clear console buffer

/usr/local/bin/obsidian dev:errors                     # show captured errors
/usr/local/bin/obsidian dev:errors clear               # clear error buffer
```

## Chrome DevTools Protocol

Execute CDP commands directly:

```
/usr/local/bin/obsidian dev:cdp method="Page.captureScreenshot"
/usr/local/bin/obsidian dev:cdp method="Runtime.evaluate" params='{"expression":"1+1"}'
/usr/local/bin/obsidian dev:cdp method="DOM.getDocument"
```

### Debug Attachment

```
/usr/local/bin/obsidian dev:debug on                   # attach CDP debugger
/usr/local/bin/obsidian dev:debug off                  # detach CDP debugger
```

## Screenshots

```
/usr/local/bin/obsidian dev:screenshot                 # screenshot to default path
/usr/local/bin/obsidian dev:screenshot path="~/Desktop/obsidian.png"   # custom path
```

## DevTools and Mobile

```
/usr/local/bin/obsidian devtools                       # toggle Electron DevTools

/usr/local/bin/obsidian dev:mobile on                  # enable mobile emulation
/usr/local/bin/obsidian dev:mobile off                 # disable mobile emulation
```

## Plugin Development Workflow

Useful command sequence for plugin developers:

```bash
# Reload plugin after code changes
/usr/local/bin/obsidian plugin:reload id="my-plugin"

# Check for errors
/usr/local/bin/obsidian dev:errors

# View console output from plugin
/usr/local/bin/obsidian dev:console level=log

# Inspect plugin's DOM
/usr/local/bin/obsidian dev:dom selector=".my-plugin-view"

# Screenshot for docs
/usr/local/bin/obsidian dev:screenshot path="docs/screenshot.png"
```
