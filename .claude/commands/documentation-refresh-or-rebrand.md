---
name: documentation-refresh-or-rebrand
description: Workflow command scaffold for documentation-refresh-or-rebrand in gitagent-protocol.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /documentation-refresh-or-rebrand

Use this workflow when working on **documentation-refresh-or-rebrand** in `gitagent-protocol`.

## Goal

Performs a comprehensive documentation refresh or rebranding, updating CLI/package names and references across docs, examples, and code.

## Common Files

- `package.json`
- `package-lock.json`
- `src/index.ts`
- `src/commands/*.ts`
- `README.md`
- `docs.md`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update package.json and package-lock.json with new name, version, description, and repository fields.
- Update CLI self-name and version in src/index.ts and related command files.
- Update all documentation files (README.md, docs.md, CONTRIBUTING.md, paper, etc.) to reflect new names and features.
- Update .github/workflows as needed for publishing or CI changes.
- Update example READMEs and inline code references.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.