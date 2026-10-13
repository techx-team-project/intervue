# AGENTS.md — InterVue (shared entry for non-Claude tools)

Cursor, Codex, Copilot, Gemini CLI and other agents: read this first. Claude Code uses `CLAUDE.md` (same rules, plus imports).
**Do not duplicate rules in tool-specific files** — point them to this file.

## Project

AI-assisted IT recruitment platform. Roles: Candidate, Recruiter, Admin (one account can hold several). AI assists; recruiters decide.

- `backend/` — Java 25, Spring Boot 4.1, MySQL + Flyway, Redis, JWT.
- `frontend/` — Next.js 16, React 19, TypeScript, Tailwind 4, Zod.

## Read before coding

| Topic | File |
|---|---|
| Backend architecture | `docs/ai/architecture.md` |
| Conventions (both sides) | `docs/ai/conventions.md` |
| Domain terms | `docs/ai/domain-glossary.md` |
| Frontend | `docs/ai/frontend-guide.md`, `frontend/AGENTS.md` |
| API contract | `docs/ai/api-contract.md` |
| Module-specific rules | `CLAUDE.md` inside the module folder (e.g. `backend/src/main/java/com/techx/intervue/modules/user/CLAUDE.md`) |

## Rules

1. Match surrounding code style; smallest correct change; no new dependencies without asking.
2. Never commit/print secrets; never run destructive commands without approval.
3. Verify (build, lint, tests) before saying "done"; report real output.
4. Don't invent requirements — see `FUNCTION_REQUIRMENT.md`, `docs/`.
5. English for code/comments/commits; Vietnamese for UI copy.
6. Conventional Commits; PRs target `dev`; commit only when asked.

## Commands

```bash
docker compose up -d
cd backend  && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local && ./mvnw test && ./mvnw spotless:apply
cd frontend && npm run dev && npm run lint && npm run build
```
