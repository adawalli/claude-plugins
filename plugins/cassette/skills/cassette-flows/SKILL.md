---
name: cassette-flows
description: "Help users create, edit, debug, and optimize Cassette meeting transcript processing flows. Cassette is a CLI tool that watches for transcript files (JSON/VTT), runs them through LLM prompt chains, and outputs structured Markdown. Use this skill when the user mentions cassette, meeting transcripts, transcript processing, prompt chains for meetings, or wants to set up automated meeting note generation. Also use when the user wants to generate Obsidian-formatted meeting notes, debug why a transcript failed processing, write or improve cassette prompts, or design multi-step flows for transcript cleanup and summarization."
---

# Cassette Flows

Help users build and maintain Cassette processing pipelines. Cassette watches a directory for meeting transcript files, sends them through one or more LLM prompts, and writes structured Markdown output.

GitHub: https://github.com/adawalli/cassette

Run without installing: `bunx @cassette-meetings/cli` or `npx @cassette-meetings/cli`
Install globally (optional): `bun add -g @cassette-meetings/cli` or `npm install -g @cassette-meetings/cli`

Global install gives you a `cassette` command, but `bunx`/`npx` works just as well for everyday use and in LaunchAgent configs. The user doesn't need to install globally unless they want to.

## What you can help with

1. **Create new configs** - run `cassette init` and walk the user through customizing their `config.yaml`
2. **Design prompt chains** - help write and iterate on the LLM prompts used in processing steps
3. **Add or modify steps** - extend an existing flow with new processing stages
4. **Debug failures** - diagnose why transcripts fail, inspect error logs, validate config
5. **Generate Obsidian-formatted output** - craft prompts that produce notes with YAML front matter, wikilinks, and Obsidian conventions
6. **Optimize for specific transcript sources** - tune extraction settings for different transcript formats (MacWhisper, Otter, Teams, Zoom, etc.)
7. **Set up macOS notifications** - install terminal-notifier and configure `on_complete` hooks
8. **Run as a system service** - set up a macOS LaunchAgent so cassette starts automatically at login

## Reference materials

Before generating or editing configs, load the relevant reference:

- **Config schema** (all fields, types, defaults): [references/config-schema.md](references/config-schema.md)
- **Working example** (two-step flow with intake): [references/example-config.yaml](references/example-config.yaml)

Read the schema reference first so you know the exact field names and constraints. The example config shows how a real flow fits together.

## How cassette works

Cassette's processing pipeline:

```
[intake (optional)] -> [watch directory] -> [extract transcript] -> [step 1: LLM] -> [step 2: LLM] -> ... -> [output .md] -> [on_complete hook]
```

Key concepts:

- **Watch** monitors a directory for `.json` and `.vtt` files, waits for them to stabilize, then queues them. Many users just drop transcripts straight into this directory - that's the simplest setup.
- **Intake** (optional) watches a separate source directory (like Downloads) and moves matching files into the watch directory, organized by week. Only needed when transcripts land somewhere the user can't control.
- **Steps** are chained LLM calls. Each step's output becomes the next step's input. You can use a single `prompt:` or multiple `steps:` (not both)
- **On complete** fires a shell command after the final step (macOS notifications, moving files, etc.)

Files are processed serially (one at a time) to avoid overwhelming the LLM endpoint.

## Creating a new config

Start with `cassette init` to generate a starter config, then modify it based on the user's needs. This is faster and less error-prone than writing a config from scratch.

### Step 1: Generate the starter config

```bash
# generates ~/.config/cassette/config.yaml
bunx @cassette-meetings/cli init

# or with a custom path
bunx @cassette-meetings/cli init --config ~/path/to/config.yaml

# overwrite an existing config
bunx @cassette-meetings/cli init --force
```

The starter config includes sensible defaults: a single-prompt flow, `~/Documents/meetings` as the watch directory, and commented-out sections for intake and on_complete hooks.

### Step 2: Gather user needs

Ask the user these questions to know what to change in the generated config:

1. **Where do transcripts come from?** This determines format and transcript extraction settings.
   - **VTT (Teams, Zoom, Meet)** - the most common format. VTT files are parsed natively, so no transcript extraction tuning is needed. However, the `transcript` section must still exist in the config (cassette validates it even for VTT-only workflows - just leave the defaults).
   - **JSON (MacWhisper, Otter, etc.)** - needs `transcript.path`, `transcript.speaker_field`, and `transcript.text_field` configured to match the JSON structure. MacWhisper typically uses a root array with `speaker` + `text` fields.
   - **Other** - ask about the file format and JSON structure

2. **How do transcripts get to cassette?**
   - If the user drops files into a known folder (or a tool exports there), just set that as `watch.root_dir` - no intake needed. This is the simpler default.
   - If transcripts land somewhere messy (like ~/Downloads), enable the `intake` section to auto-move matching files into `watch.root_dir` organized by week.

3. **What LLM endpoint?** Any OpenAI-compatible API works. Sets `llm.base_url` and `llm.model`. The user needs an API key set as `OPENAI_API_KEY` in their environment.

4. **What should the output look like?** This drives the prompt design:
   - Plain markdown summary (the starter config default)
   - Obsidian-formatted with YAML front matter and wikilinks
   - A specific template the user has in mind
   - Multi-step (clean first, then summarize) - replace the single `prompt:` with a `steps:` array

5. **Any special needs?**
   - Name corrections (common with transcription software)
   - Domain-specific terms or acronyms
   - Notifications on completion
   - Copying output to a second location (see `output.copy_to`)

### Step 3: Modify the generated config

Read the generated config, apply the user's answers, and write it back. Use the config schema reference for exact field names and types. For multi-step flows, replace the `prompt:` field with a `steps:` array - the example config shows a complete two-step clean-then-summarize setup.

## Writing good cassette prompts

Cassette prompts receive the extracted transcript as input. The prompt you write is sent to the LLM along with the transcript text. Tips:

### Structure prompts clearly

Give the LLM a role, numbered instructions, and explicit output format. Transcripts can be long, so front-load the important instructions.

### Use `<notes_for_ai>` blocks for metadata

This pattern works well for supplying context that helps the LLM without cluttering the main instructions:

```yaml
prompt: |
  Your main instructions here...

  <notes_for_ai>
  <names>
    <explanation>Correct spellings for names the transcription gets wrong</explanation>
    - Sarah (not Sara)
    - Miguel (not Michael)
  </names>
  <terms>
    - JIRA - project tracking tool
    - OKR - objectives and key results
  </terms>
  </notes_for_ai>
```

### Multi-step flows

The most common pattern is clean-then-summarize:

- **Step 1 (clean)**: Fix transcription errors, merge fragments, preserve speaker labels
- **Step 2 (summarize)**: Structured summary with sections, action items, key points

Each step gets the previous step's output as input, so step 2 works with clean text rather than raw transcript noise.

### Understanding output files

Each step writes its own output file using the step's `suffix` field. For a source file called `standup-2026-03-18.vtt` with a two-step flow:

| Step | Suffix | Output file |
| --- | --- | --- |
| clean | `.cleaned.md` | `standup-2026-03-18.cleaned.md` |
| summarize | `.summary.md` | `standup-2026-03-18.summary.md` |

All output files land in the same directory as the source transcript. The last step's output is what `on_complete` and `copy_to` reference. The intermediate files (like the cleaned transcript) stick around for debugging but the final summary is the one the user typically cares about.

For a single-prompt config (no steps), the output uses `output.markdown_suffix` (default `.md`).

### Obsidian-formatted output

When the user wants Obsidian-compatible notes, include in the prompt:

- YAML front matter with the fields their vault expects (date, tags, people, etc.)
- `[[wikilink]]` format for people, tools, and concepts
- Checkbox format for action items: `- [ ] [[Owner]]: task`
- Instruction to not wrap front matter in code fences (common LLM mistake)

See the example config's summarize step for a complete Obsidian prompt.

## Debugging cassette issues

Common problems and where to look:

| Symptom                 | Likely cause                                             | Fix                                                                 |
| ----------------------- | -------------------------------------------------------- | ------------------------------------------------------------------- |
| Files not detected      | Wrong `include_glob` or `watch.root_dir`                 | Check paths, run `cassette --debug`                                 |
| "markdown_exists" skips | Output file already exists                               | Set `output.overwrite: true` or delete old outputs                  |
| LLM timeout             | Long transcript + slow model                             | Increase `llm.timeout_ms`, or use a faster model for the clean step |
| Empty/garbled output    | Wrong `transcript.path` or field names                   | Check JSON structure, adjust JSONPath                               |
| Files stuck processing  | `stable_window_ms` too high, or file still being written | Lower the value, or wait for the source app to finish               |
| Moved to `_failed/`     | LLM error or extraction failure                          | Read the `.error.log` next to the failed file                       |
| Sandbox blocks API call | Claude Code sandbox restricts outbound network           | Run cassette outside the sandbox, or allow the LLM endpoint host    |
| Permission denied        | File or directory not writable                           | Check directory permissions on `watch.root_dir` and output paths    |

To inspect a failure:

1. Check the `_failed/` directory in `watch.root_dir`
2. Read the `.error.log` file next to the quarantined transcript
3. Run `cassette --debug --once` to see verbose output for all pending files

### Sandbox and permission gotchas

When cassette (or a tool invoking cassette) runs inside Claude Code's sandbox, outbound network requests to the LLM endpoint may be blocked. Symptoms include timeouts or connection refused errors that work fine outside the sandbox. Either run cassette outside the sandbox, or add the LLM endpoint host to the sandbox allow list.

Similarly, if `watch.root_dir`, `output.copy_to`, or the intake source directory lives outside the sandbox's writable paths, cassette will fail with permission errors. This is common with iCloud directories (`~/Library/Mobile Documents/...`) or paths under `/Library/`. Check directory permissions and sandbox write rules if cassette reports access errors on paths you know exist.

## Validating a config

After writing or editing a config, do a quick sanity check:

1. Verify `prompt` and `steps` are not both present (cassette rejects this)
2. Confirm `watch.root_dir` exists or will be created
3. If using intake, confirm `intake.source_dir` exists
4. Check that `llm.base_url` ends with `/`
5. If using `copy_to`, confirm the destination path exists (see below)
6. Remind the user to set `OPENAI_API_KEY` in their environment

### Copying output to a second location

The `output.copy_to` field sends the final output file to a second directory after processing. This is useful when the user wants processed notes in a different location from the raw transcripts - for example, a notes app vault, a shared team folder, or a synced directory. Only the last step's output gets copied (not intermediate files). The destination directory must already exist.

```yaml
output:
  copy_to: ~/path/to/notes/Meetings
```

The user can test with: `cassette --debug --once` to process existing files and see verbose output.

## macOS notifications with terminal-notifier

Cassette's `on_complete` hook can trigger native macOS notifications when a transcript finishes processing. This uses `terminal-notifier`, a small utility that sends notifications to Notification Center.

### Installing terminal-notifier

Check if it's already installed:

```bash
command -v terminal-notifier
```

If not, install via Homebrew:

```bash
brew install terminal-notifier
```

After install, the binary lives at `/opt/homebrew/bin/terminal-notifier` (Apple Silicon) or `/usr/local/bin/terminal-notifier` (Intel). Use the full path in the config since LaunchAgents don't inherit your shell's PATH.

### Configuring the hook

Add an `on_complete` block to the config. Template variables available:

- `{{input}}` - path to the source transcript file
- `{{output}}` - path to the final output markdown
- `{{root_dir}}` - the watch directory
- `{{step_name}}` and `{{step_output}}` - available when a step has `notify: true`

Basic notification that opens the output file when clicked:

```yaml
on_complete:
  command: '/opt/homebrew/bin/terminal-notifier -title "Cassette" -message "Transcribed {{input}}" -open "file://{{output}}"'
  timeout_ms: 10000
```

Per-step notifications work when `notify: true` is set on a step. This fires the hook after that step completes (not just at the end), which is useful for long chains where you want early feedback.

### If the user doesn't want terminal-notifier

Other options for the `on_complete` hook:

- **osascript**: `osascript -e 'display notification "Done: {{input}}" with title "Cassette"'` (no install needed, but no click-to-open)
- **afplay**: `afplay /System/Library/Sounds/Glass.aiff` (just a sound, no visual)
- **Any shell command**: move files, send a webhook, trigger a script - it's just `sh -c`

## Running cassette as a macOS service

For hands-free operation, cassette can run as a LaunchAgent - it starts automatically when you log in and restarts if it crashes.

### Step 1: Create the plist

The user needs to fill in their actual paths and API key. Generate the plist with their real values:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>com.cassette.transcriber</string>

    <key>ProgramArguments</key>
    <array>
      <string>/opt/homebrew/bin/bunx</string>
      <string>-y</string>
      <string>@cassette-meetings/cli</string>
      <string>--config</string>
      <string>REPLACE_WITH_CONFIG_PATH</string>
    </array>

    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>

    <key>EnvironmentVariables</key>
    <dict>
      <key>OPENAI_API_KEY</key>
      <string>REPLACE_WITH_API_KEY</string>
    </dict>

    <key>StandardOutPath</key>
    <string>REPLACE_WITH_HOME/Library/Logs/cassette.log</string>
    <key>StandardErrorPath</key>
    <string>REPLACE_WITH_HOME/Library/Logs/cassette.error.log</string>

    <key>WatchPaths</key>
    <array>
      <string>REPLACE_WITH_CONFIG_PATH</string>
    </array>
  </dict>
</plist>
```

When generating this for the user, replace all placeholders with their actual values:

- `REPLACE_WITH_CONFIG_PATH` - their config.yaml path (e.g., `/Users/username/.config/cassette/config.yaml`)
- `REPLACE_WITH_API_KEY` - their API key
- `REPLACE_WITH_HOME` - their home directory (use absolute paths, no `~`)

The `WatchPaths` entry on the config file tells launchd to restart cassette whenever the config changes, so edits take effect automatically. Do NOT add `WatchPaths` for the transcript directory - cassette handles that watch internally.

The `bunx -y` approach works great here - it always pulls the latest version and doesn't require a global install. If the user happens to have cassette installed globally, they can use the binary path instead (`which cassette`), but there's no reason to install globally just for the service.

### Step 2: Save and load

Save the plist to `~/Library/LaunchAgents/com.cassette.transcriber.plist`, then load it:

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.cassette.transcriber.plist
launchctl kickstart -k gui/$(id -u)/com.cassette.transcriber
```

### Step 3: Verify it's running

```bash
launchctl print gui/$(id -u)/com.cassette.transcriber
```

Tail the logs to confirm it started:

```bash
tail -f ~/Library/Logs/cassette.log ~/Library/Logs/cassette.error.log
```

### Managing the service

Stop and unload:

```bash
launchctl bootout gui/$(id -u)/com.cassette.transcriber
```

Restart after config changes (usually automatic via WatchPaths, but manual if needed):

```bash
launchctl kickstart -k gui/$(id -u)/com.cassette.transcriber
```

### Troubleshooting the service

| Symptom                       | Check                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| Service won't start           | `launchctl print gui/$(id -u)/com.cassette.transcriber` for exit code                    |
| Starts then immediately stops | Check `~/Library/Logs/cassette.error.log` - usually a missing env var or bad config path |
| `bunx` not found              | Use full path `/opt/homebrew/bin/bunx` - LaunchAgents don't load shell profiles          |
| API key not working           | Confirm the key in the plist matches what works in your terminal                         |
| Logs not appearing            | Create the Logs directory first: `mkdir -p ~/Library/Logs`                               |
