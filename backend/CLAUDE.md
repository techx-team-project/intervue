# Backend (Spring Boot) — rules

Stack: Java 25, Spring Boot 4.1.1 (Web, Data JPA, Security, Validation), MySQL 8.4 + Flyway, Redis 7.4 + Bucket4j, jjwt 0.12, Lombok, Maven Wrapper, Spotless (Google Java Format AOSP).
Base package `com.techx.intervue`. Architecture and conventions are imported from the root `CLAUDE.md`; details in `docs/ai/architecture.md`.

## Golden rules

1. **Package by module, then by layer:** `modules/<module>/{controllers,entities,enums,repositories,requests,resources,services/{interfaces,impl}}`.
2. **One-way layering:** Controller → Service (interface) → Repository. Controllers hold no business logic.
3. **Never expose entities.** In = `*Request`, out = `*Resource`, mapped explicitly.
4. **Every response is `ApiResource<T>`** via `BaseController.ok()/created()`; errors via the global exception handler.
5. **Schema changes only via Flyway:** `db/migration/V<yyyyMMdd><NNN>__<snake_case>.sql`. Never edit an applied migration.
6. **Constructor injection** (`@RequiredArgsConstructor`); inject service **interfaces**.
7. **Authorize every endpoint** (`@PreAuthorize`) and check resource ownership (IDOR) in the service.
8. **Cross-module calls only through the other module's service interface.**

## Don'ts

- No entities in controllers; no `@Transactional` on controllers; no external/AI calls inside a transaction.
- No tokens, passwords, CV text or other PII in logs (use `traceId` from MDC).
- No unpaged `findAll()` on large tables.
- No comments by default; only one short single-line English comment for genuinely complex logic. No Javadoc on every method.
- No silent `catch`; no `@Data` / `@EqualsAndHashCode` on entities.

## Commands

```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=local   # needs docker compose up -d
./mvnw test
./mvnw spotless:apply
```

Use `/new-feature`, `/new-migration`, `/fix-test`, skill `api-endpoint`, agents `code-reviewer` and `test-writer`.
