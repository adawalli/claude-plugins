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
obsidian eval code="app.vault.getName()"
obsidian eval code="app.workspace.getActiveFile()?.path"
obsidian eval code="Object.keys(app.plugins.plugins)"
obsidian eval code="app.vault.getMarkdownFiles().length"
```

Access the full Obsidian API via the `app` global. Useful for operations not covered by CLI
commands.

## DOM Inspection

Query and inspect DOM elements:

```
obsidian dev:dom selector=".workspace-leaf"             # first match outerHTML
obsidian dev:dom selector=".workspace-leaf" all         # all matches
obsidian dev:dom selector=".workspace-leaf" text        # text content
obsidian dev:dom selector=".workspace-leaf" inner       # innerHTML
obsidian dev:dom selector=".workspace-leaf" total       # element count
obsidian dev:dom selector=".nav-file-title" attr=data-path  # attribute value
obsidian dev:dom selector=".view-header" css=background     # CSS property value
```

## CSS Inspection

Inspect computed CSS with source locations:

```
obsidian dev:css selector=".workspace-leaf"             # all CSS for selector
obsidian dev:css selector=".workspace-leaf" prop=background  # specific property
```

## Console and Errors

Capture and view console output:

```
obsidian dev:console                    # show recent console messages
obsidian dev:console limit=20           # last 20 messages
obsidian dev:console level=error        # errors only
obsidian dev:console level=warn         # warnings only
obsidian dev:console level=log          # logs only
obsidian dev:console level=info         # info only
obsidian dev:console level=debug        # debug only
obsidian dev:console clear              # clear console buffer

obsidian dev:errors                     # show captured errors
obsidian dev:errors clear               # clear error buffer
```

## Chrome DevTools Protocol

Execute CDP commands directly:

```
obsidian dev:cdp method="Page.captureScreenshot"
obsidian dev:cdp method="Runtime.evaluate" params='{"expression":"1+1"}'
obsidian dev:cdp method="DOM.getDocument"
```

### Debug Attachment

```
obsidian dev:debug on                   # attach CDP debugger
obsidian dev:debug off                  # detach CDP debugger
```

## Screenshots

```
obsidian dev:screenshot                 # screenshot to default path
obsidian dev:screenshot path="~/Desktop/obsidian.png"   # custom path
```

## DevTools and Mobile

```
obsidian devtools                       # toggle Electron DevTools

obsidian dev:mobile on                  # enable mobile emulation
obsidian dev:mobile off                 # disable mobile emulation
```

## Plugin Development Workflow

Useful command sequence for plugin developers:

```bash
# Reload plugin after code changes
obsidian plugin:reload id="my-plugin"

# Check for errors
obsidian dev:errors

# View console output from plugin
obsidian dev:console level=log

# Inspect plugin's DOM
obsidian dev:dom selector=".my-plugin-view"

# Screenshot for docs
obsidian dev:screenshot path="docs/screenshot.png"
```
