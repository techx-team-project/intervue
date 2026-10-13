# InterVue — Project Context (Claude Code)

AI-assisted IT recruitment platform (TopCV-like). Roles: **Candidate**, **Recruiter**, **Admin**; one account may hold several roles.
AI assists; **recruiters make the final decision** — AI never auto-accepts or auto-rejects a candidate.
Product docs: `README.md`, `docs/product-overview.md`, `docs/candidate-features.md`, `FUNCTION_REQUIRMENT.md`.

## Monorepo

```
backend/    Java 25 · Spring Boot 4.1 · MySQL 8.4 + Flyway · Redis 7.4 · JWT   (backend/CLAUDE.md)
frontend/   Next.js 16 · React 19 · TypeScript · Tailwind 4 · Zod              (frontend/CLAUDE.md)
docs/ai/    Long-form AI-facing docs, imported below
.claude/    Shared Claude Code config: settings, commands, agents, skills, hooks
```

Nested `CLAUDE.md` files (`backend/`, `frontend/`, `backend/.../modules/<module>/`) load automatically when you work in those folders.

## Imported docs

@docs/ai/architecture.md
@docs/ai/conventions.md
@docs/ai/domain-glossary.md
@docs/ai/git-commit.md

Load on demand (not imported): `docs/ai/frontend-guide.md` (frontend work), `docs/ai/api-contract.md` (any API change).

## Commands

```bash
docker compose up -d                              # MySQL + Redis
cd backend  && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
cd backend  && ./mvnw test && ./mvnw spotless:apply
cd frontend && npm run dev | npm run lint | npm run build
```

PowerShell: use `.\mvnw.cmd`. Git Bash: `./mvnw`.

## Working agreement

1. Read the code around your change first; match its style and naming. Do not add comments (see Code comments in `docs/ai/conventions.md`).
2. Smallest correct change. No drive-by refactors; no new dependency without asking.
3. Never print or commit secrets (`.env`, `application-local.yml`). Never run destructive commands (`git reset --hard`, force-push, `docker compose down -v`, drop tables) without explicit approval.
4. Verify before claiming done: run build/lint/test and report real output; say so if you could not run something.
5. Ambiguous behavior → check `FUNCTION_REQUIRMENT.md` / `docs/`, then ask. Don't invent requirements.
6. Features touching DB + API + UI: use plan mode, share the plan, then implement.
7. Code and commits in English. UI copy in Vietnamese. Write no comments unless the code is truly hard to follow; then a single short English line.
8. **Never commit on your own after finishing code. Ask the user to confirm first, and commit only after they say yes.** Same for push. Follow `docs/ai/git-commit.md` exactly: `type(scope): description`, branches `type/scope-description`, PR into `dev`. **Never add `Co-Authored-By` or any AI attribution to commits or PRs.**

## Shared tooling (`.claude/`)

| Item | Use |
|---|---|
| `/new-feature <name>` | Scaffold a backend feature/module |
| `/new-migration <description>` | Create a correctly named Flyway migration |
| `/new-page <route>` | Scaffold a frontend page |
| `/fix-test` | Run tests, read failures, fix |
| agent `code-reviewer` | Read-only review against conventions |
| agent `test-writer` | Writes unit/integration tests |
| skill `api-endpoint` | Full workflow + templates for one endpoint |

Personal notes go in `CLAUDE.local.md` and `.claude/settings.local.json` (git-ignored).
Using another AI tool (Cursor/Codex/Copilot)? Point it to `AGENTS.md`.
