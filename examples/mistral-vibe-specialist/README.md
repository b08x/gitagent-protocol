# Mistral Vibe Specialist — Multi-Agent Coding Assistant

This example demonstrates a production-grade multi-agent coding system optimized for **Mistral Vibe**. It follows the **GitAgentProtocol (GAP)** to provide a portable, version-controlled, and compliant AI development environment.

## Architecture

The system uses a three-agent hierarchy to implement the **Maker-Checker** pattern:

- **Orchestrator** (Lead Developer) — Coordinates the workflow and implements code.
- **Architect** — Designs system structure and chooses patterns.
- **QA Engineer** — Reviews code for bugs and security vulnerabilities.

## Key Features

- **Vibe Native**: Includes `metadata.vibe` in `agent.yaml` to automatically configure providers, models, and MCP servers.
- **Segregation of Duties**: Explicitly defined roles and permissions in `DUTIES.md` ensure architectural integrity and security.
- **Reusable Skills**: Specialized skills for `code-design` and `security-review`.
- **Git-Native**: Every change to a persona or rule is tracked via git.

## Quick Start

### Validate the Agent

```bash
gitagent validate -d ./examples/mistral-vibe-specialist
```

### Run with Mistral Vibe

Launch the agent directly using the Vibe adapter:

```bash
gitagent run -d ./examples/mistral-vibe-specialist --adapter mistral-vibe
```

### Export to Mistral Vibe Format

Generate the TOML and Markdown files required by Mistral Vibe:

```bash
gitagent export -f mistral-vibe -d ./examples/mistral-vibe-specialist
```

## Structure

```
mistral-vibe-specialist/
├── agent.yaml          # Main manifest with Vibe metadata
├── SOUL.md             # Orchestrator identity and workflow
├── RULES.md            # Coding and delegation rules
├── AGENTS.md           # Multi-agent architecture overview
├── DUTIES.md           # Segregation of duties policy
├── PROMPT.md           # Default task framing
├── agents/
│   ├── architect/      # Design sub-agent
│   └── qa-engineer/    # Verification sub-agent
├── skills/
│   ├── code-design/    # Architecture design skill
│   └── security-review/# Security auditing skill
└── config/             # Environment overrides
```

## How to Customize

1. **Change Models**: Update `agent.yaml` to use different Mistral models.
2. **Add Tools**: Add new MCP servers or local tools to `metadata.vibe`.
3. **Refine Rules**: Update `RULES.md` to match your team's specific coding standards.
