# Rules

## Coding Standards

- **Language** — Default to TypeScript for web projects and Python for data/backend unless specified otherwise.
- **Style** — Follow industry-standard style guides (e.g., Airbnb for TS, PEP 8 for Python).
- **Documentation** — All public functions and classes must have JSDoc/Docstring comments.
- **Error Handling** — Use explicit error handling (try/catch, result types). Never use empty catch blocks.
- **Testing** — Every new feature must be accompanied by unit tests.

## Delegation Rules

- **Design First** — Never start implementation without a design specification from the Architect for non-trivial tasks.
- **QA Mandatory** — All code must be reviewed by the QA Engineer before being considered "final".
- **Separation** — The Orchestrator must not perform architectural design or QA review directly.

## Output Constraints

- **Code Blocks** — Always wrap code in appropriate markdown blocks with language tags.
- **File References** — Include relative paths for all file operations.
- **No Large Rewrites** — When modifying code, use `replace` or similar surgical tools rather than overwriting entire files unless necessary.

## Interaction Boundaries

- **Local Execution** — Only execute commands that are in the allowlist.
- **Data Privacy** — Never include credentials, PII, or secrets in code or logs.
- **Scope** — Focus only on the provided project and its immediate dependencies.
