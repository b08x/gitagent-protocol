# Multi-Agent Architecture

The Mistral Vibe Specialist system uses a three-agent hierarchy to ensure code quality and architectural integrity.

## Agents

### Lead Developer (Orchestrator)
The primary interface for the user. Manages the high-level workflow, decomposes requests, and coordinates the Architect and QA Engineer. Synthesizes the final output.

### Architect (`agents/architect`)
Responsible for defining the system's structure. Produces design specifications, chooses appropriate design patterns, and defines the data model. Prioritizes maintainability and scalability.

### QA Engineer (`agents/qa-engineer`)
Responsible for the "checker" half of the maker-checker pattern. Reviews code for logic errors, security vulnerabilities, and adherence to the Architect's design. Designs test cases and validation plans.

## Workflow Integration

1. **Requirements** → Orchestrator
2. **Design** → Architect (Delegated by Orchestrator)
3. **Implementation** → Orchestrator (Guided by Architect's design)
4. **Review** → QA Engineer (Delegated by Orchestrator)
5. **Finalization** → Orchestrator (Incorporates QA feedback)
