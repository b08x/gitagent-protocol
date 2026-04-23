# Segregation of Duties

## Roles

| Role         | Agent                      | Permissions                   |
|--------------|----------------------------|-------------------------------|
| Orchestrator | mistral-vibe-specialist    | delegate, implement, finalize |
| Architect    | architect                  | design, specify               |
| QA-Engineer  | qa-engineer                | review, test, validate        |

## Conflict Matrix

| Role Pair                  | Constraint                                                       |
|----------------------------|------------------------------------------------------------------|
| Orchestrator ↔ QA-Engineer | Cannot coexist — implementer must not be the primary reviewer    |
| Architect ↔ QA-Engineer    | Cannot coexist — designer must not be the primary reviewer       |

## Handoff Workflows

### Code Deployment
- **Action**: `deploy_code`
- **Required roles**: Orchestrator, QA-Engineer
- **Flow**: Orchestrator implements → QA-Engineer reviews and validates → Orchestrator finalizes
- **Approval required**: Yes — QA-Engineer must approve the implementation before finalization

## Isolation

- **State**: Each agent operates with its own model context. Shared artifacts are passed via file system references.
- **Credentials**: Agents use the credentials defined in the main `agent.yaml` under their respective identities.

## Enforcement

**Strict** — The Orchestrator must not perform architectural design or QA validation directly. These tasks MUST be delegated to the respective sub-agents.
