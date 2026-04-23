---
name: security-review
description: "Audits code for security vulnerabilities, insecure patterns, and data leaks. Use when code is ready for review or when security is a primary concern."
license: MIT
metadata:
  author: gitagent
  version: "1.0.0"
  category: security
---

# Security Review

## Instructions
When performing a security review:

1. **Check for Injections** — SQL, Command, NoSQL, and Template injection.
2. **Review Data Handling** — Are secrets hardcoded? Is PII leaked in logs? Is sensitive data encrypted?
3. **Authentication/Authorization** — Are checks performed at every entry point? Are defaults secure?
4. **Dependency Audit** — Look for known vulnerable versions in package manifests.
5. **Logic Flaws** — Check for race conditions, insecure random number generation, and improper error handling that leaks system info.

## Output Format
```markdown
## Security Audit Report

### Summary
[Overall risk assessment: LOW/MEDIUM/HIGH]

### Findings

#### [Severity] — [Vulnerability Type]
- **Issue**: [Description]
- **Location**: [File/Line]
- **Remediation**: [How to fix]

### Secure Coding Recommendations
- [Rec 1]
- [Rec 2]
```
