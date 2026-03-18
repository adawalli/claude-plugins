# Cassette Config Schema Reference

Complete field reference for `~/.config/cassette/config.yaml`. All fields unless noted otherwise.

## Top-level structure

```yaml
intake: # optional - auto-import files from another directory
watch: # required - where to find transcripts
output: # optional - output file settings (has defaults)
failure: # optional - error handling (has defaults)
llm: # optional - LLM endpoint config (has defaults)
transcript: # required - how to extract text from JSON files (ignored for VTT)
prompt: # use this OR steps, not both
steps: # use this OR prompt, not both
on_complete: # optional - shell hook after processing
```

## intake (optional)

Watches a source directory and moves/copies matching files into `watch.root_dir` before processing.

| Field           | Type     | Default      | Description                           |
| --------------- | -------- | ------------ | ------------------------------------- |
| `source_dir`    | string   | required     | Directory to watch for incoming files |
| `include_glob`  | string   | `"**/*.vtt"` | Glob pattern for files to import      |
| `exclude_glob`  | string[] | `[]`         | Glob patterns to skip                 |
| `delete_source` | boolean  | `true`       | `true` = move, `false` = copy         |

Files are organized into week-based subdirectories: `YYYY/MM-DD/filename.ext`

## watch (required)

| Field              | Type     | Default             | Description                                      |
| ------------------ | -------- | ------------------- | ------------------------------------------------ |
| `root_dir`         | string   | required            | Directory containing transcript files            |
| `stable_window_ms` | integer  | `3000`              | Wait for file to stop changing before processing |
| `include_glob`     | string   | `"**/*.{json,vtt}"` | Which files to process                           |
| `exclude_glob`     | string[] | `["**/_failed/**"]` | Which files to skip                              |

## output

| Field             | Type    | Default | Description                                  |
| ----------------- | ------- | ------- | -------------------------------------------- |
| `markdown_suffix` | string  | `".md"` | Suffix for output files                      |
| `overwrite`       | boolean | `false` | Re-process files that already have output    |
| `copy_to`         | string  | -       | Optional second destination for final output |

## failure

| Field             | Type    | Default     | Description                                |
| ----------------- | ------- | ----------- | ------------------------------------------ |
| `move_failed`     | boolean | `true`      | Move failed source files to a subdirectory |
| `failed_dir_name` | string  | `"_failed"` | Name of the failure subdirectory           |
| `write_error_log` | boolean | `true`      | Write `.error.log` next to failed files    |

## llm

| Field            | Type         | Default                        | Description                     |
| ---------------- | ------------ | ------------------------------ | ------------------------------- |
| `base_url`       | string (URL) | `"https://api.openai.com/v1/"` | OpenAI-compatible API endpoint  |
| `model`          | string       | `"gpt-4o"`                     | Model identifier                |
| `temperature`    | number (0-2) | `0.1`                          | Creativity/randomness           |
| `max_tokens`     | integer      | `4000`                         | Max response length             |
| `timeout_ms`     | integer      | `120000`                       | Request timeout                 |
| `retries`        | integer      | `5`                            | Retry count on transient errors |
| `retry_delay_ms` | integer      | `5000`                         | Delay between retries           |

Requires `OPENAI_API_KEY` environment variable.

## transcript

Only applies to JSON files. VTT files are parsed natively.

| Field           | Type              | Default  | Description                       |
| --------------- | ----------------- | -------- | --------------------------------- |
| `path`          | string (JSONPath) | `"$[*]"` | JSONPath to the transcript array  |
| `speaker_field` | string            | -        | JSON field name for speaker label |
| `text_field`    | string            | -        | JSON field name for spoken text   |

## prompt (string)

Single LLM prompt. The extracted transcript is appended as input. Mutually exclusive with `steps`.

## steps (array)

Prompt chain where each step's output becomes the next step's input. Mutually exclusive with `prompt`.

| Field    | Type    | Default                  | Description                                             |
| -------- | ------- | ------------------------ | ------------------------------------------------------- |
| `name`   | string  | required                 | Step identifier (used in logs and errors)               |
| `prompt` | string  | required                 | LLM prompt for this step                                |
| `suffix` | string  | `output.markdown_suffix` | Output filename suffix                                  |
| `llm`    | object  | -                        | Per-step LLM overrides (any field from top-level `llm`) |
| `notify` | boolean | `false`                  | Fire `on_complete` hook after this step                 |

## on_complete (optional)

Shell command to run after processing completes.

| Field        | Type    | Default  | Description                           |
| ------------ | ------- | -------- | ------------------------------------- |
| `command`    | string  | required | Shell command with template variables |
| `timeout_ms` | integer | `10000`  | Command timeout                       |

Template variables: `{{input}}`, `{{output}}`, `{{root_dir}}`. When `notify: true` on a step: `{{step_name}}`, `{{step_output}}`.

## CLI usage

```bash
cassette              # watch mode (continuous)
cassette --once       # backfill mode (process existing, then exit)
cassette --config X   # custom config path
cassette init         # generate starter config
cassette init --force # overwrite existing config
cassette --debug      # verbose logging
```

Install: `bun add -g @cassette-meetings/cli` or `npm install -g @cassette-meetings/cli`
