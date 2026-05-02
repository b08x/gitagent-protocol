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
| `manifest.metadata.vibe.providers` | `config.toml` → `[[providers]]` | Automated API provider configuration |
| `manifest.metadata.vibe.models` | `config.toml` → `[[models]]` | Automated custom model definitions |
| `manifest.metadata.vibe.mcp_servers` | `config.toml` → `[[mcp_servers]]` | Automated MCP server integration |
| `manifest.compliance.supervision.human_in_the_loop` | `agents/<agent>.toml` → `tools.*.permission` | `none` maps to `always`, others to `ask` |
| `manifest.metadata.vibe.tools` | `agents/<agent>.toml` → `tools.*` | Deep merged tool overrides (allowlist, patterns) |
| `skills/*/SKILL.md` | `skills/<skill>/SKILL.md` | Direct mapping with reconstructed frontmatter |
| `skills/*/{scripts,references,assets}/*` | `skills/<skill>/{subfolder}/*` | Recursive asset collection (supports binary files) |
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
# === config.toml ===
[[providers]]
name = "mistral"
...

[[mcp_servers]]
name = "fetch"
...

# === agents/my-agent.toml ===
active_model = "mistral-large-latest"
system_prompt_id = "my-agent"
autocopy_to_clipboard = true
enable_telemetry = false

[tools.bash]
permission = "always"
allowlist = ["ls", "git status"]

# === prompts/my-agent.md ===
...
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
- Skill assets (recursive collection of `scripts/`, `references/`, and `assets/`)
- Binary file support (exported as bit-for-bit copies)
- Model preferences
- Basic tool permissions (always/ask)
- **New:** Automated `config.toml` generation for `providers`, `models`, and `mcp_servers` via `metadata.vibe`.
- **New:** Deep-merged tool overrides (e.g. adding an `allowlist` to the default `bash` tool).

## What Requires Manual Setup

⚠️ **Not Automatically Mapped:**

### 1. Provider Credentials
**Issue:** Mistral Vibe expects `MISTRAL_API_KEY` or other provider keys in the environment.

**Workaround:** Ensure your environment variables are set before running `gitagent run`.

### 2. Binary Files in Text Export
**Issue:** When using `gitagent export` to stdout or a text file, binary files (images, binaries) are omitted and replaced with a placeholder (e.g., `[Binary file omitted from text export: 1024 bytes]`) to prevent terminal corruption.

**Workaround:** Use `gitagent run` to see the full agent in action, or check the source repository for the binary assets.

## Resources

- [Mistral Vibe GitHub](https://github.com/mistralai/mistral-vibe)
- [Mistral AI Documentation](https://docs.mistral.ai/)
- [gitagent Specification](../../spec/SPECIFICATION.md)
