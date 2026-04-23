# GitAgentProtocol (GAP) Manager (`gapman`)

`gapman` is a framework-agnostic, git-native standard for defining, versioning, and deploying AI agents. It implements the GitAgentProtocol (GAP) to ensure agent definitions are portable across different platforms and frameworks.

## Architecture: The Adapter Pattern

The core of `gapman` is built on the **Adapter Pattern** (`src/adapters/`). This allows the tool to translate a standard GAP definition (typically `agent.yaml`) into platform-specific configurations and prompts.

### Key Adapters:
- **Claude Code** (`claude-code.ts`)
- **OpenAI** (`openai.ts`)
- **Gemini** (`gemini.ts`)
- **Cursor** (`cursor.ts`)
- **CrewAI** (`crewai.ts`)
- **And many others...**

## Core Components

- **`src/index.ts`**: CLI Entry point using `commander`.
- **`src/commands/`**: Implementation of CLI commands like `init`, `validate`, `export`, and `run`.
- **`src/runners/`**: Logic for actually executing or preparing agents for their respective platforms.
- **`src/utils/`**: Shared logic for loading manifests (`loader.ts`), handling skills (`skill-loader.ts`), and managing git integration.
- **`spec/schemas/`**: JSON schemas that define the GAP standard for tools, skills, knowledge, and agents.

## Development Workflows

- **Build**: `npm run build` (compiles TS to `dist/`).
- **Dev**: `npm run dev` (watch mode).
- **Test**: `npm run test` (runs `.test.js` files in `dist/`).
- **Validation**: `gapman validate <path>` to check an agent definition against schemas.

## Knowledge Graph (`graphify`)

This project uses `graphify` to maintain a navigable knowledge graph of the codebase in `graphify-out/`.

### Rules & Interaction:
- **Architecture Context**: Before answering architecture or codebase questions, read `graphify-out/GRAPH_REPORT.md`.
- **Navigation**: If `graphify-out/wiki/index.md` exists, use it as a entry point for exploration.
- **Maintenance**: After modifying code files, run `graphify update .` to keep the graph current.
- **Core Abstractions**: Pay special attention to "God Nodes" identified in the report:
    - `loadAgentManifest()`: Central configuration loader.
    - `info()` / `error()`: Standardized messaging.
    - `runWithGit()`: Base git execution logic.
    - `loadFileIfExists()`: Robust file I/O utility.
    - `stringifyToToml()`: Recursive TOML serialization with table array support.
    - `deepMerge()`: Recursive object merging for configuration overrides.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (AST-only, no API cost)
