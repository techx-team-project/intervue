<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# InterVue Frontend — Agent Guide

Stack: Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS 4 · Zod 4 · lucide-react. Prettier (organize-imports, tailwind, jsdoc) + ESLint 9.
Full guide: **`../docs/ai/frontend-guide.md`** (structure, data flow, UI rules). API contract: `../docs/ai/api-contract.md`.

## Golden rules

1. **Server Components by default.** Add `'use client'` only for state, effects, event handlers or browser APIs — and push it to the smallest leaf component.
2. **`app/` only routes.** `page.tsx` / `layout.tsx` stay thin: fetch + compose. UI lives in `components/<feature>/`.
3. **One place per concern:** types → `types/`, Zod schemas → `schemas/`, API calls → `apiRequest/`, hooks → `hooks/`, pure helpers → `utils/`, constants → `constants/`, fake data → `mocks/` (temporary, until the API exists).
4. **Reuse `components/ui/*`** (Button, Input, Modal, Badge, Breadcrumb) before creating new primitives. Style with Tailwind utilities + `cn()` from `lib/utils.ts`. No inline `style`, no new CSS files per component.
5. **No `any`.** Types for API data mirror `docs/ai/api-contract.md`. Validate forms and external data with Zod.
6. **Route segments are English kebab-case** (`/account/upgrade`, not `/tai-khoan/nang-cap`). UI copy is Vietnamese.
7. **Never hard-code API URLs or secrets.** Use `NEXT_PUBLIC_API_URL`; secrets stay server-side without the `NEXT_PUBLIC_` prefix.
8. Every screen handles **loading, empty, error** states and works at mobile width.

## Naming

| Thing | Convention |
|---|---|
| Component file | `PascalCase.tsx`, one exported component per file |
| Hook | `useCamelCase.ts` |
| Types / schemas / mocks | `job.ts` / `auth.schema.ts` / `job.mock.ts` |
| Route folder | `kebab-case`, dynamic `[slug]` |
| Constants | `UPPER_SNAKE_CASE` |

## Commands

```bash
npm run dev      # http://localhost:3000
npm run lint
npm run build    # must pass before PR
npx prettier --write .
```
