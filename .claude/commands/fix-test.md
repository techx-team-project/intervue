---
description: Run tests, read failures, fix the cause
argument-hint: [backend|frontend] [test class or path]
---
Fix failing tests. Scope: `$ARGUMENTS` (default: backend).

1. Backend: `cd backend && ./mvnw test` (single class: `-Dtest=<Class>`). Frontend: `cd frontend && npm run lint && npm run build`.
2. Read the first real failure (stack trace, assertion diff). Find the **root cause** in production code or in the test.
3. Fix production code if behavior is wrong; fix the test only if the test is wrong. Never weaken assertions or skip tests to go green.
4. Re-run until green. Report what failed, why, and what changed. If blocked (needs Docker, env, secrets), say so.
