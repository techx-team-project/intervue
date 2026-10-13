# Conventions (Backend + Frontend + Git)

Architecture lives in `architecture.md`; frontend structure in `frontend-guide.md`. This file is the checklist of *style* rules.

## 1. General

- Code, identifiers, comments, commit messages, PR text: **English**. UI copy: Vietnamese.
- Comments explain *why*, not *what*. No commented-out code. No TODO without an owner/issue.
- Formatting is automated (Lefthook pre-commit): Spotless (Java), Prettier (TS/JS/JSON/CSS). Don't hand-format.
- `.editorconfig` is authoritative for whitespace/line endings.

## 2. Backend (Java)

| Thing | Rule | Example |
|---|---|---|
| Package | `com.techx.intervue.modules.<module>.<layer>` | `...modules.job.services.impl` |
| Controller | `<Feature>Controller extends BaseController` | `JobController` |
| Service | `<Feature>ServiceInterface` in `interfaces/`, `<Feature>Service` in `impl/` | |
| Entity / Repository | singular noun / `<Entity>Repository` | `Job`, `JobRepository` |
| DTOs | `<Action><Entity>Request`, `<Entity>Resource` (prefer `record`) | `CreateJobRequest` |
| Enum | PascalCase type, `UPPER_SNAKE` values | `JobStatus.PUBLISHED` |
| REST | `/api/v1/<kebab-plural>`; actions as sub-resources | `POST /applications/{id}/withdraw` |
| DB | `snake_case`, plural tables, `created_at`/`updated_at` everywhere, `deleted_at` for soft delete | `job_alerts` |
| Migration | `V<yyyyMMdd><NNN>__<snake_case>.sql`, forward-only, one concern per file | `V20261014001__create_jobs_table.sql` |
| Error codes | stable `UPPER_SNAKE` strings | `EMAIL_ALREADY_USED` |

Rules:
- Constructor injection via `@RequiredArgsConstructor`; never field `@Autowired`.
- Lombok allowed: `@Getter`, `@Builder`, `@RequiredArgsConstructor`, `@Slf4j`. Not `@Data` on entities.
- `@Transactional` on service methods only; `readOnly = true` for reads. Associations `LAZY`.
- Lists are paginated (`Pageable`, max size 100). Dynamic filters via `Specification`, never string concat.
- Time = `Instant` (UTC). Money = amount + currency (`BigDecimal`/integer minor units), never `double`.
- Throw `AppException(ErrorCode.X)`; don't return error bodies from controllers manually.
- Tests: `<Class>Test`; Mockito for services, `@WebMvcTest` for controllers, Testcontainers (MySQL, Redis) for integration. Each endpoint: happy path, validation, 401, 403, ownership (IDOR).

## 3. Frontend (TypeScript)

| Thing | Rule |
|---|---|
| Components | `PascalCase.tsx`, one exported component per file, explicit `Props` type |
| Hooks | `useCamelCase.ts` in `hooks/` |
| Types / schemas / mocks | `types/job.ts`, `schemas/auth.schema.ts`, `mocks/job.mock.ts` |
| Routes | English `kebab-case`; dynamic `[slug]` |
| Constants | `UPPER_SNAKE_CASE` in `constants/` |
| Imports | `@/` alias; auto-sorted by Prettier |

Rules:
- Server Components by default; `'use client'` only on leaf components that need it.
- `any` is forbidden; validate forms and external data with Zod.
- Styling: Tailwind + `cn()`; reuse `components/ui/*`; no inline styles.
- All API access through `apiRequest/`; components never call `fetch` directly.
- Every screen: loading, empty, error states; works at 375 px; keyboard accessible.
- Access token in memory only; never in `localStorage`.

## 4. API

- Envelope `ApiResource<T>` (see `api-contract.md`). Frontend branches on `error.code`, never on `message`.
- Any endpoint change updates `api-contract.md` in the same PR.

## 5. Git

- Branches: `feature/<name>`, `fix/<name>`, `docs/<name>`, `refactor/<name>` → PR into `dev`; `dev` → `main` for release.
- Conventional Commits: `feat: add job search filters`; imperative, ≤ 72 chars subject, body explains why.
- One concern per PR; PR description lists what changed, how to test, and screenshots for UI.
- Never commit `.env`, `application-local.yml`, `CLAUDE.local.md`, build output.
