---
description: Scaffold a backend feature (controller/service/repository/DTOs/migration/tests)
argument-hint: <module-name> [short description]
---
Create backend feature `$ARGUMENTS`.

1. Read `docs/ai/architecture.md` (section 11 checklist), `docs/ai/conventions.md`, `docs/ai/domain-glossary.md`. Use `modules/user` as the structural reference.
2. Present a short plan first and wait for approval: entities, endpoints, allowed roles, ownership rules, migration, error codes.
3. Implement each endpoint with the `api-endpoint` skill, and the schema with `/new-migration`.
4. Delegate tests to the `test-writer` agent, then review with the `code-reviewer` agent.
5. Run `./mvnw spotless:apply` and `./mvnw test`; update `docs/ai/api-contract.md`. Report real results.
