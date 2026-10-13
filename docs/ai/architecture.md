# Backend Architecture (Spring Boot)

Audience: developers and AI agents. Describes the **target architecture**; "Current" notes mark where the code differs today.
Origin: adapted from `hoangtuanqn/spring-boot-ecommerce-api` (layered + JWT + RBAC + Redis), then changed for a recruitment domain — see [Deviations](#9-deviations-from-the-ecommerce-base).

## 1. Principles

- **Modular monolith.** One deployable, strict module boundaries, so a module can be extracted later.
- **Package by feature, layer inside.** Easy to find everything about "job" in one place.
- **Thin controllers, rich services, dumb repositories.**
- **Explicit DTOs** at every boundary; entities never leave the service layer.
- **Security and auditability are features**, not afterthoughts (PII, CVs, identity documents).

## 2. Package layout

```
com.techx.intervue
├─ IntervueApplication.java
├─ config/            Spring config only: SecurityConfig, RedisConfig, AppConfig, AuthConfig, (CorsConfig, AsyncConfig)
├─ filters/           TraceIdFilter, JwtAuthFilter, (RateLimitFilter)
├─ controllers/       BaseController, PingController            (cross-cutting only)
├─ resources/         ApiResource, ErrorResource, FieldErrorResource
├─ exceptions/        AppException, ErrorCode, GlobalExceptionHandler           <- add (not present yet)
├─ common/            Shared helpers & infra services (CookieHelper, IpHelper, TokenHashUtil, BlacklistService)
│                       Current: modules/helpers + services/{impl,interfaces}. Move to common/ when touched.
└─ modules/
   ├─ user/           accounts, roles, auth, sessions (refresh tokens)       [exists]
   ├─ candidate/      profile, experience, skills, education, CVs, saved jobs, alerts
   ├─ company/        company profile, verification, followers
   ├─ job/            job posts, search, filters, recommendations
   ├─ application/    applications, pipeline status, screening Q&A, interviews
   ├─ ai/             CV feedback, mock interview, matching, cover letter, chatbot (RAG)
   ├─ notification/   in-app, email, push
   ├─ content/        blog, FAQ
   └─ admin/          moderation, verification review, reports
```

Each module:

```
modules/job/
├─ controllers/    JobController, PublicJobController
├─ entities/       Job, JobSkill
├─ enums/          WorkingArrangement, ContractType, JobStatus
├─ repositories/   JobRepository (Spring Data JPA)
├─ requests/       CreateJobRequest, SearchJobRequest        (inbound, validated)
├─ resources/      JobResource, JobSummaryResource           (outbound)
├─ mappers/        JobMapper                                  (entity <-> DTO; plain class or MapStruct)
├─ services/
│  ├─ interfaces/  JobServiceInterface
│  └─ impl/        JobService
└─ events/         JobPublishedEvent                          (optional, for decoupling)
```

## 3. Layer responsibilities

| Layer | Does | Must NOT |
|---|---|---|
| Controller | Route, `@Valid` request, call **one** service method, wrap with `ok()/created()`, set cookies/headers | Business rules, repository calls, entity returns, `@Transactional` |
| Service | Business rules, authorization checks on resources (ownership), transactions, orchestration, publish events | Touch `HttpServletRequest`, build HTTP responses |
| Repository | Queries (derived / `@Query` / Specification) | Business logic |
| Entity | Persistence mapping, simple invariants | Jackson annotations, being returned to clients |
| Request | Shape + bean validation | Business validation needing DB (do that in service) |
| Resource | Read-only outbound shape | Lazy associations, sensitive fields |

Controllers inject the **interface** (`JobServiceInterface`).
*Current:* `AuthController` injects `UserService` (impl) — change to the interface when next edited.

## 4. API conventions

- Base path `/api/v1`. Resources are plural kebab-case nouns; actions that aren't CRUD are sub-resources: `POST /applications/{id}/withdraw`.
- Methods: `GET` read, `POST` create/action, `PUT` full replace, `PATCH` partial, `DELETE` remove (soft delete for user data).
- **Envelope** (all responses):

```json
{
  "success": true,
  "message": "Register account successfully!",
  "data": { },
  "error": null,
  "traceId": "9f2c...",
  "timestamp": "2026-10-13T09:00:00Z"
}
```

Error: `success=false`, `data=null`, `error = { code, details?, fieldErrors: [{field, message}] }`.

- **Pagination:** `?page=0&size=20&sort=createdAt,desc` → `data` is `PageResource<T>` `{ items, page, size, totalItems, totalPages }`. Max size 100.
- **Status codes:** 200/201/204, 400 validation, 401 unauthenticated, 403 forbidden, 404 not found, 409 conflict, 422 business-rule violation, 429 rate-limited.
- **Errors:** throw `AppException(ErrorCode.X)`; `GlobalExceptionHandler` maps to `ApiResource.error`. Error codes are stable `UPPER_SNAKE` strings the frontend can switch on (e.g. `EMAIL_ALREADY_USED`).
- **Dates:** `Instant` in UTC, ISO-8601. **IDs:** keep one strategy across tables (decide once: BIGINT identity internally; expose opaque/UUID public IDs for candidate/CV/application resources to prevent enumeration).
- **Money:** salary as `min`, `max`, `currency`, `period` — never floats.
- Every endpoint documented in `docs/ai/api-contract.md` (or OpenAPI via springdoc once adopted).

## 5. Authentication & authorization

- **Access token:** JWT (15 min, `jwt.expiration`), sent as `Authorization: Bearer`. Claims: `sub` (user id), `roles`, `iss=InterVue`. Keep it small.
- **Refresh token:** random opaque value, **stored hashed** (`TokenHashUtil`) in `refresh_tokens`, delivered as **HttpOnly, Secure, SameSite cookie** (`CookieHelper`), 14 days, **rotated on every use**; reuse of an old token revokes the whole family.
- **Logout / revoke:** delete refresh token(s); access-token `jti` goes to the Redis blacklist until expiry (`BlacklistServiceInterface`).
- **Session cache:** `UserSessionCache` (Redis) caches user+roles per request path; invalidate on role/ban change.
- **Roles:** `CANDIDATE`, `RECRUITER`, `ADMIN` (`RoleType`). One user ↔ many roles (`UserRole`). *Differs from the ecommerce base's single-role RBAC.*
- **Method security:** `@EnableMethodSecurity`; use `@PreAuthorize("hasRole('RECRUITER')")` on controller methods. URL rules in `SecurityConfig` only for public/permit-all and coarse prefixes (`/api/v1/admin/**`).
- **Ownership checks (IDOR):** role is not enough. Services must verify the resource belongs to the caller (candidate owns CV; recruiter belongs to the job's company). Pattern: `repository.findByIdAndOwnerId(id, currentUserId)` → 404 if absent.
- **Gating rules** (from product): candidate must pass identity verification before applying; company must be verified before posting. Enforce in the service with `ErrorCode.IDENTITY_NOT_VERIFIED` / `COMPANY_NOT_VERIFIED`.
- Passwords: BCrypt. 2FA (TOTP) and recovery codes: store secrets encrypted, recovery codes hashed.
- Current user: expose via a `CurrentUser` helper / `@AuthenticationPrincipal CustomUserDetails`; never read user id from request bodies.

## 6. Persistence

- MySQL 8.4, `utf8mb4`. Hibernate `ddl-auto=validate` (or `none`); **Flyway is the single source of truth**.
- Migration file: `V<yyyyMMdd><NNN>__<description>.sql` (e.g. `V20260923001__create_users_table.sql`). One concern per file, forward-only. Fix mistakes with a new migration.
- Table `snake_case` plural; PK `id`; always `created_at`, `updated_at` (extend a `@MappedSuperclass BaseEntity` with `@EnableJpaAuditing`); `deleted_at` for soft-deletable user data.
- Index every FK and every column used in search/filter (`jobs(status, published_at)`, `jobs(location)`, etc.). Full-text/search: start with MySQL FULLTEXT; move to OpenSearch/Elasticsearch only when needed.
- Associations `LAZY` by default; avoid N+1 with `@EntityGraph` / fetch joins / projections for list endpoints. `open-in-view: false`.
- Transactions: `@Transactional` on service methods; `readOnly = true` for queries. Keep them short — **no external HTTP/AI calls inside a transaction**.
- Dynamic filters (job search): JPA `Specification` or QueryDSL, never string concatenation.

## 7. Redis, caching, rate limiting

| Use | Key pattern | TTL |
|---|---|---|
| Token blacklist | `auth:blacklist:{jti}` | token remaining life |
| User session cache | `user:session:{userId}` | 15 min |
| Rate limit (Bucket4j) | `rl:{route}:{ip or userId}` | window |
| Job/list cache | `cache:jobs:{hash}` | 1–5 min |
| AI results / idempotency | `ai:{type}:{hash}` | per feature |

Rules: namespace every key, always set TTL, never cache per-user PII under shared keys, invalidate on write. Rate-limit auth endpoints (login, register, reset password, resend email) and AI endpoints hardest.

## 8. Cross-cutting

- **Validation:** Jakarta Bean Validation on `*Request`; custom constraints for reusable rules (strong password, phone). DB-dependent rules in the service.
- **Logging:** SLF4J (`@Slf4j`), `traceId` in MDC set by `TraceIdFilter`, returned in every response. Never log secrets/PII/CV text.
- **Config:** `application.yaml` (committed, no secrets, `${ENV:default}` placeholders) + `application-local.yml` (git-ignored secrets). Typed config via `@ConfigurationProperties` (`AuthConfig`).
- **Async & events:** Use Spring `ApplicationEventPublisher` for in-process side effects (send email, notify, index). Use `@Async` with a bounded executor. Introduce a queue (Redis Streams / RabbitMQ) only when retries/durability are required.
- **File storage:** CVs, avatars, identity documents behind a `StorageService` interface (local disk in dev, S3-compatible in prod). Store only keys in DB; serve via short-lived signed URLs; validate type and size; virus-scan hook for CVs; identity docs in a private bucket.
- **Email:** `MailService` interface, templates, async, retry.
- **CORS:** explicit allowed origins from config (frontend URL), `allowCredentials=true` for the refresh cookie.
- **Testing:** unit tests for services (Mockito); slice tests `@DataJpaTest`, `@WebMvcTest`; integration tests with **Testcontainers** (MySQL, Redis) — not H2, to match Flyway/MySQL behavior. Name `<Class>Test`; arrange/act/assert; every new endpoint tests happy path + validation + authz (401/403/IDOR).
- **Comments:** none by default; code must be self-explanatory through naming and small methods. Only for genuinely complex, non-obvious or abstract logic, add one short single-line English `//` comment above it explaining *why*. No Javadoc on every method, no multi-line or step-by-step comments. See `conventions.md`.
- **Code style:** Spotless (Google Java Format AOSP). Prefer Java `record` for Requests/Resources/events. Lombok allowed: `@Getter`, `@Builder`, `@RequiredArgsConstructor`, `@Slf4j`; **avoid `@Data`/`@EqualsAndHashCode` on entities**.

## 9. AI module design

AI is an *assistant*; humans decide.

- Behind an `AiClient` interface (provider-swappable: Claude/OpenAI/Gemini) with config-driven model name, timeouts, retries, and a per-user quota.
- Prompts live in `resources/prompts/*.txt` (versioned), not inline strings. Output validated against a schema (JSON) before use.
- Persist AI results with `model`, `prompt_version`, `created_at` so decisions are auditable; show candidates when their data is processed by AI.
- Heavy calls (CV parsing, matching) run async; API returns a job id/status for polling or SSE.
- No auto-accept/reject. Fairness: don't feed protected attributes (age, gender, photo) into matching.
- RAG chatbot: embeddings store (pgvector/Redis/Qdrant — decide later) over `docs/` + FAQ; guard against prompt injection from CV/JD content (treat as untrusted data).

## 10. Deviations from the ecommerce base

| Ecommerce base | Here | Why |
|---|---|---|
| Single role per user | Many roles per user (`UserRole`) | One email can be Candidate + Recruiter |
| Product / cart / order / payment domain | job / application / company / candidate profile / AI | Different domain |
| Inventory & payment consistency (locking, idempotency) | Application state machine (`APPLIED → IN_REVIEW → INTERVIEW → OFFER → HIRED / REJECTED / WITHDRAWN`) with allowed transitions in one place | Pipeline correctness matters more |
| Ownership mostly "own order" | Ownership via **company membership** + candidate ownership; IDOR checks mandatory | Recruiters act for a company |
| Little sensitive data | PII, CVs, identity docs (eKYC) | Encryption, private storage, retention, audit log, soft-delete + restore |
| Public catalog caching | Search-heavy + personalised results | Cache public lists only; never cache personalised data under shared keys |
| No AI | AI module (async, audited, provider-agnostic) | Core product feature |
| Layer-first packages (common in ecommerce samples) | Feature-first modules | Easier ownership, extractable later |
| Helper/infra code inside a module (`modules/helpers`) | `common/` | Modules shouldn't import from a peer's internals |

## 11. Checklist: add a module / endpoint

1. Migration `V<date><NNN>__create_<table>.sql` (+ indexes, FKs).
2. Entity (+ enum) → Repository.
3. `*Request` (validation) / `*Resource` / Mapper.
4. `ServiceInterface` + `Service` (rules, ownership, `@Transactional`).
5. Controller extends `BaseController`; path `/api/v1/...`; `@PreAuthorize`; `@Valid`.
6. Add `ErrorCode`s; update `SecurityConfig` only if public.
7. Tests: service unit + controller slice (+ authz cases).
8. `./mvnw spotless:apply && ./mvnw test`; update `docs/ai/api-contract.md`.
