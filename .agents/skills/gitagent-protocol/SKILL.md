```markdown
# gitagent-protocol Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches you the core development patterns, coding conventions, and collaborative workflows used in the `gitagent-protocol` TypeScript codebase. The repository focuses on schema-driven configuration, protocol specification, and robust documentation practices. You'll learn how to contribute new features, update documentation, propose RFCs, and follow the project's conventions for maintainable and consistent code.

## Coding Conventions

- **File Naming:**  
  Use `camelCase` for file names.  
  _Example:_  
  ```
  src/utils/loader.ts
  src/commands/validate.ts
  ```

- **Import Style:**  
  Use relative imports for modules within the project.  
  _Example:_  
  ```typescript
  import { validateConfig } from '../utils/loader';
  ```

- **Export Style:**  
  Use named exports for all modules.  
  _Example:_  
  ```typescript
  export function validateConfig(config: AgentConfig): boolean { ... }
  ```

- **Commit Messages:**  
  Use [Conventional Commits](https://www.conventionalcommits.org/) with prefixes such as `fix`, `docs`, `feat`, `rfc`, `chore`, `ci`.  
  _Example:_  
  ```
  feat: add support for custom agent schemas
  fix: correct YAML parsing in loader
  ```

## Workflows

### Add or Update Schema-Backed Feature
**Trigger:** When introducing a new feature or config block that requires schema validation and documentation  
**Command:** `/add-schema-feature`

1. **Edit or add schema:**  
   Update `spec/schemas/agent-yaml.schema.json` to define or modify the schema for the new feature.
   ```json
   {
     "properties": {
       "myNewFeature": {
         "type": "string",
         "description": "Description of the new feature"
       }
     }
   }
   ```
2. **Add example usage:**  
   Update or add example YAML in `examples/full/agent.yaml` or create a new example directory.
   ```yaml
   myNewFeature: "example value"
   ```
3. **Document the feature:**  
   Update `spec/SPECIFICATION.md` to describe the new feature and its validation rules.
4. **Update implementation:**  
   Modify implementation code to support the new schema (e.g., `src/adapters/shared.ts`, `src/commands/validate.ts`).
5. **Update types/interfaces:**  
   Add or update TypeScript types as needed (e.g., `src/utils/loader.ts`).

---

### Documentation Refresh or Rebrand
**Trigger:** When rebranding the project or updating documentation for major changes  
**Command:** `/rebrand-docs`

1. **Update package metadata:**  
   Edit `package.json` and `package-lock.json` for new name, version, description, and repository fields.
2. **Update CLI and commands:**  
   Change CLI self-name and version in `src/index.ts` and related command files.
3. **Refresh documentation:**  
   Update all documentation (`README.md`, `docs.md`, `CONTRIBUTING.md`, `paper/*`) to reflect new names and features.
4. **Update CI workflows:**  
   Edit `.github/workflows/*.yml` as needed for publishing or CI changes.
5. **Update examples:**  
   Update example `README.md` files and inline code references.
6. **Preserve migration notes:**  
   Add historical notes for migration or compatibility.

---

### Feature or Spec RFC Addition
**Trigger:** When proposing or documenting a new feature or protocol extension  
**Command:** `/add-rfc`

1. **Create or update RFC:**  
   Add a markdown file in `spec/rfcs/` describing the new feature.
   ```markdown
   # RFC: Custom Agent Hooks

   ## Summary
   Proposal for supporting custom hooks in agent configuration.
   ```
2. **Update specification:**  
   Reference the RFC or document the feature in `spec/SPECIFICATION.md`.
3. **Add example usage:**  
   Optionally, add example YAML in `examples/full/agent.yaml`.

---

## Testing Patterns

- **Test File Naming:**  
  Test files use the pattern `*.test.*`, typically colocated with the source or in a `tests/` directory.
  _Example:_  
  ```
  src/utils/loader.test.ts
  ```

- **Testing Framework:**  
  The specific framework is not detected, but tests are written in TypeScript and follow standard patterns.

- **Test Example:**  
  ```typescript
  import { validateConfig } from './loader';

  test('validates correct config', () => {
    expect(validateConfig({ myNewFeature: 'ok' })).toBe(true);
  });
  ```

## Commands

| Command            | Purpose                                                         |
|--------------------|-----------------------------------------------------------------|
| /add-schema-feature| Add or update a schema-backed feature with validation & docs     |
| /rebrand-docs      | Perform a documentation refresh or project rebranding           |
| /add-rfc           | Propose or document a new feature or protocol extension (RFC)   |
```
