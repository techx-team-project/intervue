---
description: Scaffold a frontend page following docs/ai/frontend-guide.md
argument-hint: <route> [short description]
---
Create frontend page `$ARGUMENTS`.

1. Read `frontend/CLAUDE.md` and `docs/ai/frontend-guide.md` (section 10 checklist). Check `node_modules/next/dist/docs/` for any Next.js API you use.
2. Reuse `components/ui/*`; feature UI in `components/<feature>/`; keep `page.tsx` thin; English kebab-case route.
3. Add types/schema/apiRequest/hook as needed; handle loading, empty, error; verify at 375 px.
4. Run `npm run lint && npm run build` in `frontend/` and report results.
