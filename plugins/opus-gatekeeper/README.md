# Opus Permission Gatekeeper

Routes Bash permission requests to Opus 4.5 for intelligent security evaluation. Safe commands are auto-approved; risky ones fall through to the user.

## How It Works

When Claude Code requests permission to run a Bash command, this hook intercepts the request and sends it to Opus 4.5 for evaluation. Opus analyzes the command context and returns:

- `{"ok": true}` — Command is auto-approved
- `{"ok": false, "reason": "..."}` — Command is denied, user sees the reason

## What Gets Approved

Standard development operations:

- Package managers: `npm`, `yarn`, `pnpm`, `brew`, `apt`
- Version control: `git` commands
- Build tools: `make`, `cargo`, `go build`, etc.
- Test runners: `npm test`, `pytest`, `vitest`, etc.
- Read-only commands: `ls`, `cat`, `grep`, `find`, `pwd`
- Dev servers: `npm run dev`, `python -m http.server`

## What Gets Denied

Potentially dangerous operations:

- Destructive commands: `rm -rf`, `dd`, `mkfs`, `format`
- System modification: `sudo`, `chmod 777`, `chown root`
- Sensitive file access: `~/.ssh`, `~/.aws`, `/etc/passwd`
- Network exfiltration: `curl | bash`, reverse shells
- Obfuscated commands: base64-encoded, hex-encoded
- Prompt injection attempts in arguments

## Uncertain Cases

When Opus can't confidently determine safety, it returns `{"ok": false, "reason": "Requires user review"}`, letting the user make the final call.

## Trade-offs

**Pros:**

- Context-aware evaluation (not just pattern matching)
- Detects sophisticated attacks and obfuscation
- Conservative when uncertain (fail-safe)

**Cons:**

- Latency: Opus calls add delay to permission requests
- Cost: More expensive than Haiku/Sonnet per evaluation

## Configuration

The hook is configured in `hooks/hooks.json`:

- **matcher**: `Bash` — Only evaluates shell commands
- **model**: `opus` — Uses Opus 4.5 for reasoning
- **timeout**: 60 seconds

## Enabling/Disabling

Enable via Claude Code plugin management:

```
/plugins install opus-gatekeeper
```

Or add to your `.claude/settings.json`:

```json
{
  "plugins": ["adawalli/opus-gatekeeper"]
}
```

To disable temporarily, remove from settings or uninstall the plugin.

## Debugging

Run Claude Code with debug mode to see hook execution:

```bash
claude --debug
```

Check loaded hooks:

```
/hooks
```
