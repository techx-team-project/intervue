---
name: api-endpoint
description: Add or change one REST endpoint end-to-end in the Spring Boot backend (request, resource, service, controller, security, tests, contract doc). Use when asked to build an API endpoint.
---
# api-endpoint

Build one endpoint following InterVue conventions. Templates are in `templates/` (placeholders `${module}`, `${Entity}`, `${Action}`, `${kebab-plural}`).

Write no comments in generated code unless the logic is genuinely complex (then one short single-line English comment).

## Steps

1. **Clarify**: HTTP method + path (`/api/v1/<kebab-plural>`), who may call it, input/output, business rules, error cases. Check `docs/ai/domain-glossary.md` for terms and `FUNCTION_REQUIRMENT.md` for the requirement. Ask if unclear.
2. **Schema**: if tables or columns change, run `/new-migration`.
3. **Request**: `templates/Request.java.tpl` (validated, prefer `record`).
4. **Resource**: `templates/Resource.java.tpl` (no entities, no sensitive fields).
5. **Service**: add the method to `*ServiceInterface`, implement in `impl/` with `templates/Service.java.tpl`. Business rules, ownership check and `@Transactional` live here. Throw `AppException(ErrorCode.X)`.
6. **Controller**: `templates/Controller.java.tpl`. Extends `BaseController`, `@Valid`, `@PreAuthorize`, returns `ok()` / `created()`.
7. **Tests**: delegate to the `test-writer` agent (happy path, validation, 401, 403, ownership).
8. **Contract**: add or update the row in `docs/ai/api-contract.md`, plus any new error codes.
9. **Verify**: `cd backend && ./mvnw spotless:apply && ./mvnw test`, then run the `code-reviewer` agent.

## Checklist before finishing

- [ ] Entity never leaves the service layer
- [ ] Authorization declared; ownership verified in the service
- [ ] List endpoints paginated (max 100)
- [ ] No PII or tokens in logs
- [ ] Rate limit considered (auth, AI, email-sending endpoints)
- [ ] Contract doc updated
