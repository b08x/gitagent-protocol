# Mistral Vibe Adapter

Complete mapping guide for converting between gitagent and Mistral Vibe (CLI) formats.

## Overview

Mistral Vibe is Mistral AI's open-source terminal-native coding assistant. It uses:

- **config.toml** for general settings, model selection, and tool permissions.
- **Agent profiles** (TOML files in `~/.vibe/agents/`) for specialized assistant behavior.
- **System prompts** (Markdown files in `~/.vibe/prompts/`) for core instructions.
- **Skills** (folders in `~/.vibe/skills/` containing `SKILL.md`) for extended capabilities.

The gitagent Mistral Vibe adapter enables:
1. **Export**: Convert gitagent → Mistral Vibe folder structure
2. **Run**: Execute gitagent agents using `vibe` CLI

## Installation

```bash
# Install Mistral Vibe
pip install mistral-vibe

# Verify installation
vibe --version
```

## Field Mapping

### Export: gitagent → Mistral Vibe

| gitagent | Mistral Vibe | Notes |
|----------|--------------|-------|
| `SOUL.md` + `RULES.md` + `DUTIES.md` | `prompts/<agent>.md` | Consolidated system prompt |
| `manifest.name` | `agents/<agent>.toml` → `system_prompt_id` | Slugified name used as prompt reference |
| `manifest.model.preferred` | `agents/<agent>.toml` → `active_model` | Preferred model ID |
| `manifest.compliance.supervision.human_in_the_loop` | `agents/<agent>.toml` → `tools.*.permission` | `none` maps to `always`, others to `ask` |
| `skills/*/SKILL.md` | `skills/<skill>/SKILL.md` | Direct mapping with reconstructed frontmatter |
| `agents/` (sub-agents) | `agents/<subagent>.toml` + `prompts/<subagent>.md` | Full multi-agent support |

## Tool Permission Mapping

Mistral Vibe controls tool execution via permissions in the agent configuration.

| gitagent `human_in_the_loop` | vibe Tool Permission | Behavior |
|------------------------------|-----------------------|----------|
| `none` | `always` | Auto-approve tool execution |
| `always` | `ask` | Prompt for user approval |
| `conditional` | `ask` | Prompt for user approval |
| `advisory` | `ask` | Prompt for user approval |

## Usage Examples

### Export to Mistral Vibe

```bash
# Export to stdout (simulated folder structure)
gitagent export --format mistral-vibe -d ./my-agent

# Save to file (concatenated output)
gitagent export --format mistral-vibe -d ./my-agent -o vibe-export.txt
```

**Output Structure:**
```
# === agents/my-agent.toml ===
active_model = "mistral-large-latest"
system_prompt_id = "my-agent"
autocopy_to_clipboard = true
enable_telemetry = false

[tools.bash]
permission = "ask"

# === prompts/my-agent.md ===
# my-agent
Agent description
[SOUL.md content]
[RULES.md content]

# === skills/my-skill/SKILL.md ===
---
name: my-skill
...
---
[Instructions]
```

### Run with Mistral Vibe

```bash
# Launch interactive session
gitagent run ./my-agent --adapter mistral-vibe

# Launch with initial prompt
gitagent run ./my-agent --adapter mistral-vibe -p "Refactor this module"
```

**What Happens:**
1. Creates a temporary directory structure matching Mistral Vibe's expectations.
2. Writes TOML configs for the main agent and any sub-agents.
3. Writes Markdown prompts and skills.
4. Spawns the `vibe` CLI pointing to the temporary configuration.

## What Maps Cleanly

✅ **Fully Supported:**
- Main agent instructions (SOUL/RULES/DUTIES)
- Sub-agent delegation (multi-TOML export)
- Skill portability (SKILL.md reconstruction)
- Model preferences
- Basic tool permissions (always/ask)

## What Requires Manual Setup

⚠️ **Not Automatically Mapped:**

### 1. Provider Credentials
**Issue:** Mistral Vibe expects `MISTRAL_API_KEY` or other provider keys in the environment.

**Workaround:** Ensure your environment variables are set before running `gitagent run`.

### 2. MCP Servers
**Issue:** Mistral Vibe configuration for MCP servers is not yet mapped from `agent.yaml`.

**Workaround:** Manually add `[[mcp_servers]]` blocks to the exported TOML if required.

### 3. Skill Assets/Scripts
**Issue:** Currently, only the `SKILL.md` is exported. Supporting files in `scripts/` or `references/` are not yet moved.

## Resources

- [Mistral Vibe GitHub](https://github.com/mistralai/mistral-vibe)
- [Mistral AI Documentation](https://docs.mistral.ai/)
- [gitagent Specification](../../spec/SPECIFICATION.md)
