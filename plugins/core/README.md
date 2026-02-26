# Claude Core Plugin

Personal curated collection of Claude Code commands, agents, skills, and workflows for TDD,
debugging, collaboration patterns, and proven development techniques.

## Installation

### From Marketplace

```bash
claude plugin add adawalli/core
```

### From Git Repository

```bash
claude plugin add https://github.com/adawalli/claude-core.git
```

### Local Development

```bash
cd ~/dev/claude/claude-plugins
git clone https://github.com/adawalli/claude-core.git
```

## Available Commands

### `/git-commit`

Smart git commit command with conventional commit format and emoji support.

**Features:**

- Automatically runs pre-commit checks (lint, format) unless `--no-verify` is specified
- Analyzes staged changes to suggest atomic commits
- Creates well-formatted commit messages using emoji conventional commit format
- Stages all modified files if nothing is staged
- Follows best practices for commit hygiene

**Usage:**

```bash
/git-commit                    # Interactive commit with analysis
/git-commit "Custom message"   # Commit with custom message
/git-commit --no-verify        # Skip pre-commit checks
/git-commit --amend           # Amend previous commit
```

**Commit Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or fixing tests
- `chore`: Build process, tools, etc.

## Available Agents

The plugin includes five specialized agents for code quality, testing, and documentation:

### `code-refactoring-expert`

Transforms complex, repetitive, or poorly structured code into clean, maintainable solutions
following DRY principles.

**Use when:**

- Code has duplicated logic across multiple methods
- Functions are overly long or have nested conditionals
- Code violates DRY principles or needs simplification

**Key features:**

- Enforces test coverage before refactoring
- Applies incremental refactoring with test verification
- Extracts common functionality and simplifies conditionals
- Maintains performance while improving readability

### `code-review-specialist`

Provides elite-level code reviews catching security vulnerabilities, performance issues, and edge
cases.

**Use when:**

- Implementing significant functionality needing review
- Preparing merge/pull requests
- Need comprehensive security and quality analysis

**Key features:**

- Security review for injection vulnerabilities and auth flaws
- Performance analysis for bottlenecks and memory leaks
- Edge case identification and error handling validation
- Structured review output with severity prioritization

### `doc-quality-reviewer`

Ensures documentation is concise, accurate, and maintainable through systematic quality review.

**Use when:**

- Documentation needs accuracy verification
- Docs may have drifted from implementation
- Need to ensure conciseness and maintainability

**Key features:**

- Conciseness audit removing verbose and redundant content
- Accuracy verification against actual code and configs
- DRY principle enforcement across documentation
- Structured review with specific improvement recommendations

### `docs-fetcher`

Retrieves and consolidates documentation from web sources into clean, actionable markdown.

**Use when:**

- Need API documentation from third-party services
- Integrating with unfamiliar APIs or services
- Want web documentation formatted for developer use

**Key features:**

- Fetches and parses documentation from URLs
- Consolidates into well-structured markdown
- Preserves code examples and technical details
- Returns formatted documentation directly (no file creation unless requested)

### `unit-test-expert`

Specializes in Test-Driven Development (TDD) methodology and high-quality unit test creation.

**Use when:**

- Writing tests following TDD red/green/refactor cycle
- Reviewing existing unit tests for quality
- Ensuring tests provide value beyond coverage metrics

**Key features:**

- TDD methodology guidance and enforcement
- Test quality assessment for structure and effectiveness
- Anti-pattern detection for brittle or implementation-focused tests
- Framework-agnostic expertise (Jest, pytest, JUnit, RSpec, etc.)

## Skills

Skills are planned for future releases and will include:

- TDD workflows
- Debugging techniques
- Code review patterns
- Collaboration best practices
- Architecture decision patterns

## Development

### Project Structure

```
claude-core/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── agents/
│   ├── code-refactoring-expert.md
│   ├── code-review-specialist.md
│   ├── doc-quality-reviewer.md
│   ├── docs-fetcher.md
│   └── unit-test-expert.md
├── commands/
│   └── git-commit.md        # Git commit command
├── skills/                  # Future skills
└── README.md               # This file
```

### Contributing

This is a personal plugin collection. Feel free to fork and adapt for your own use.

## License

MIT

## Author

Adam Wallis
