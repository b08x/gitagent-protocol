---
name: add-or-update-schema-backed-feature
description: Workflow command scaffold for add-or-update-schema-backed-feature in gitagent-protocol.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-or-update-schema-backed-feature

Use this workflow when working on **add-or-update-schema-backed-feature** in `gitagent-protocol`.

## Goal

Adds or updates a schema-backed feature (e.g., new config block) with validation, documentation, and example usage.

## Common Files

- `spec/schemas/agent-yaml.schema.json`
- `examples/*/agent.yaml`
- `spec/SPECIFICATION.md`
- `src/adapters/*.ts`
- `src/commands/validate.ts`
- `src/utils/loader.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or add the relevant section in spec/schemas/agent-yaml.schema.json to define the schema.
- Update or add example YAML in examples/ (e.g., examples/full/agent.yaml or a new example directory).
- Update SPECIFICATION.md to document the new feature and its validation rules.
- Update implementation code to support the new schema (e.g., src/adapters/shared.ts, src/commands/validate.ts).
- Add or update TypeScript types/interfaces as needed (e.g., src/utils/loader.ts).

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.