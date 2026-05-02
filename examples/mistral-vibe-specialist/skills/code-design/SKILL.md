---
name: code-design
description: "Designs software architecture, chooses patterns, and defines structural specifications. Use when the user wants to plan a new project, refactor existing code, or needs a technical design document."
license: MIT
metadata:
  author: gitagent
  version: "1.0.0"
  category: architecting
---

# Code Design

## Instructions
When designing code:

1. **Understand Requirements** — List functional and non-functional requirements.
2. **Define Structure** — Propose a directory structure and identify key modules.
3. **Choose Patterns** — Select appropriate design patterns (e.g., Factory, Strategy, Observer) and explain why they fit.
4. **Define Interfaces** — List the primary classes/functions and their expected inputs/outputs.
5. **Data Model** — Describe the primary data structures or database schema.
6. **Diagram** — Use Mermaid.js to visualize the architecture if helpful.

## Output Format
```markdown
## Design Specification: [Project Name]

### 1. Requirements Summary
- [Req 1]
- [Req 2]

### 2. Architecture Overview
[High-level description]

### 3. File Structure
```text
src/
  ├── components/
  ├── services/
  └── index.ts
```

### 4. Key Abstractions & Patterns
- **[Pattern Name]**: [Usage in project]

### 5. Implementation Roadmap
- [Step 1]
- [Step 2]
```
