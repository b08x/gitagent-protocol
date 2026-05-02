# Walkthrough: Creating a gitagent for Mistral Vibe

This guide provides a detailed walkthrough for creating a gitagent repository optimized for use with **Mistral Vibe**, Mistral AI's terminal-native coding assistant.

## Overview

The `gitagent` Mistral Vibe adapter automates the generation of:
- **`config.toml`**: Global configuration (providers, models, MCP servers).
- **Agent Profiles**: Individual TOML configs with deep-merged tool permissions.
- **System Prompts**: Consolidated Markdown instructions.
- **Portable Skills**: Reconstructed SKILL.md files and assets.

---

## 1. Prerequisites

- **GAP CLI (`gapman` / `gitagent`)**: Installed via `npm install -g @open-gitagent/gapman`.
- **Mistral Vibe**: Installed via `pip install mistral-vibe`.
- **API Key**: `MISTRAL_API_KEY` set in your environment.

---

## 2. Initialize a New Agent

Create a new directory and scaffold a standard agent:

```bash
mkdir my-vibe-agent
cd my-vibe-agent
gitagent init --template standard
```

---

## 3. Configure the Manifest (`agent.yaml`)

Mistral Vibe requires specific configurations for providers and models. Use the `metadata.vibe` section to automate these.

### Custom Providers & Models
Define your API providers and model aliases directly in the manifest:

```yaml
# agent.yaml
name: code-master
version: 1.0.0
description: Expert coding assistant for Mistral Vibe

model:
  preferred: mistral-large-latest

metadata:
  vibe:
    providers:
      - name: mistral
        api_base: https://api.mistral.ai/v1
        backend: mistral
    models:
      - name: mistral-large-latest
        provider: mistral
        alias: production
```

### MCP Server Integration
Add Model Context Protocol (MCP) servers to extend your agent's capabilities:

```yaml
metadata:
  vibe:
    mcp_servers:
      - name: fetch
        transport: stdio
        command: uvx
        args: ["mcp-server-fetch"]
```

### Deep-Merged Tool Overrides
Control tool behavior with Mistral Vibe-specific properties. These are merged with default `gitagent` permissions:

```yaml
metadata:
  vibe:
    tools:
      bash:
        permission: always # Override default 'ask' behavior
        allowlist: ["ls", "cat", "git status"]
      read_file:
        permission: always
```

---

## 4. Define Identity and Rules

Edit `SOUL.md` and `RULES.md` to define how your agent should behave. These are consolidated into a single system prompt during export.

**`SOUL.md`**:
```markdown
# Soul
I am a precision-focused coding assistant. I prioritize readability and maintainable patterns.
```

**`RULES.md`**:
```markdown
# Rules
- Always use TypeScript for new code.
- Never suggest insecure dependencies.
```

---

## 5. Adding Skills

Add reusable skills to the `skills/` directory. Each skill should have a `SKILL.md` file.

```bash
mkdir -p skills/git-expert
cat > skills/git-expert/SKILL.md <<EOF
---
name: git-expert
description: Advanced git operations
allowed-tools: bash
---
# Instructions
Help the user manage complex git workflows like interactive rebasing.
EOF
```

---

## 6. Running Your Agent

You can launch your agent directly using the Mistral Vibe runner:

```bash
gitagent run -d . --adapter mistral-vibe
```

**What happens behind the scenes:**
1. GAP CLI creates a temporary directory.
2. It generates a full Vibe workspace (including the `config.toml` from your metadata).
3. It sets the `VIBE_HOME` environment variable.
4. It launches `vibe --agent <your-agent-name>`.

---

## 7. Manual Export

If you prefer to manage your `~/.vibe` directory manually, use the export command:

```bash
gitagent export -f mistral-vibe -o export_preview.txt
```

This will output a representation of the files you need to place in your Vibe home directory.

---

## Troubleshooting

### Validation Errors
If `gitagent validate` fails, ensure your `metadata.vibe` structure matches the expected types (objects and arrays). The schema now supports nested objects in metadata.

### Missing Tools
If a tool isn't showing up in Vibe, check that:
1. It is listed in the `allowed-tools` frontmatter of an active skill.
2. It is included in `enabled_tools` in your `metadata.vibe` (if you are using an explicit list).

### VIBE_HOME
The runner relies on the `VIBE_HOME` environment variable to redirect the CLI. If you encounter issues with persistent logs or settings, check if your local Vibe installation respects this variable.
