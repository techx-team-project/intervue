# Frontend Guide (Next.js)

Audience: developers and AI agents. Based on the structure of `hoangtuanqn/maplearn-platform-web-nextjs` (feature components, typed API layer, Zod forms, server/client state split), updated for **Next.js 16 / React 19 / Tailwind 4** and InterVue's roles.

> Next.js 16 has breaking changes vs. older versions (e.g. `middleware` → `proxy`, async request APIs like `params`/`cookies()`/`headers()`). **Check `node_modules/next/dist/docs/` before using a Next API** you're not 100% sure about.

## 1. Folder structure

```
frontend/
├─ app/                      Routes only (App Router)
│  ├─ (public)/              Guest pages: home, jobs, companies, blog, faq        [route group, no URL segment]
│  ├─ (auth)/                login, register, forgot-password, reset-password
│  ├─ (candidate)/           candidate/profile, cv, saved-jobs, applications, ai tools
│  ├─ (recruiter)/           recruiter/jobs, candidates, company
│  ├─ (admin)/               admin/*
│  ├─ layout.tsx  globals.css  not-found.tsx  error.tsx
├─ components/
│  ├─ ui/                    Primitives: Button, Input, Modal, Badge, Breadcrumb  (no business logic)
│  ├─ common/                Header, Footer, Pagination, EmptyState, Spinner       (shared layout/pieces)
│  └─ <feature>/             home, job-detail, company-detail, candidate-profile, auth, blog, ...
├─ apiRequest/               API layer: http client + one file per resource (job.ts, auth.ts)
├─ hooks/                    useAuth, useDebounce, useJobs (React Query wrappers)
├─ schemas/                  Zod schemas (auth.schema.ts, job.schema.ts)
├─ types/                    TS types for API data (job.ts, company.ts)
├─ store/                    Client-only global state (auth session, UI)
├─ providers/                QueryProvider, AuthProvider, ThemeProvider
├─ constants/  config/       Static data, route map, env parsing
├─ utils/  lib/              Pure helpers (salary.ts) / cn() and third-party glue
├─ mocks/                    Temporary fixtures — delete when the real API is wired
├─ public/  styles/
```

*Current state:* `apiRequest/ hooks/ store/ providers/ config/ styles/` exist but are empty — fill them as described, don't create parallel folders. Route groups `( )` are the recommended direction; migrate gradually, don't mass-rename.

### Known cleanup (do when touching these routes)

- Duplicate/mixed-language routes: `account` vs `tai-khoan`, `account/upgrade` vs `account/nang-cap` vs `upgrade`, `gifts` vs `qua-tang`, `login`/`register` vs `auth`. Pick **English** paths, keep one, add a redirect for the old one in `next.config.ts`.
- `profile` vs `candidate/profile`: candidate-only screens go under the candidate group.

## 2. Rendering & data flow

```
page.tsx (Server)  ──fetch (server)──▶ API         public, SEO pages (jobs, company, blog)
   └─ <FeatureView/> (Client) ──React Query──▶ API   interactive/authenticated pages (dashboard, profile, apply)
```

- **SEO/public pages** (job list/detail, company, blog): Server Components, server `fetch` with `next: { revalidate }` or tags, `generateMetadata`, JSON-LD `JobPosting` for job detail.
- **Authenticated/interactive pages**: Client component + **TanStack Query** (add dependency when wiring the real API). Query keys: `['jobs', filters]`, `['job', id]`.
- **Server state** (anything from API) → React Query / server fetch. **Client state** (session, UI toggles) → small store (`store/`, Zustand preferred; Redux Toolkit only if the team needs it — maplearn used Redux, we default to lighter). **URL state** (search filters, sort, page) → `searchParams` so links are shareable.
- **Mutations**: React Query `useMutation` → invalidate related keys → toast.
- Forms: **React Hook Form + Zod** (`zodResolver`); schema in `schemas/`, infer the type with `z.infer`. Server errors with `fieldErrors` map back to fields.

## 3. API layer (`apiRequest/`)

```ts
// apiRequest/http.ts  — single wrapper (fetch or axios), nothing else calls fetch directly
// - base URL from NEXT_PUBLIC_API_URL
// - attaches Authorization: Bearer <accessToken> (kept in memory, NOT localStorage)
// - credentials: 'include' (refresh cookie)
// - on 401 UNAUTHENTICATED: call POST /auth/refresh ONCE (single-flight), retry; if it fails → logout + redirect /login
// - unwraps ApiResponse<T>; throws ApiError { code, message, fieldErrors, status, traceId }
// apiRequest/job.ts   — export const jobApi = { search(params), getById(id), save(id) ... }
```

- Return typed data (`Promise<Page<Job>>`), never `any`. Types mirror `docs/ai/api-contract.md`.
- Components never build URLs or parse envelopes.
- Show `traceId` in error details/log — helps backend debugging.

## 4. Auth & authorization (UI)

- Access token in memory (store); refresh via HttpOnly cookie → session survives reload by calling `/auth/refresh` on app start (AuthProvider).
- **Route protection** in `proxy.ts` (Next 16) using the refresh cookie presence for redirects of `(candidate)`, `(recruiter)`, `(admin)`; real enforcement is the backend. Never trust UI checks for security.
- Roles come from `GET /users/me`: `CANDIDATE | RECRUITER | ADMIN`; a user may have several → provide a role switcher in the header. Use a `<RequireRole roles={[...]}>` wrapper or `useAuth().hasRole()`.
- Gating UX: not verified (eKYC) → disable "Apply" with an explanatory CTA to verification, based on `IDENTITY_NOT_VERIFIED`.

## 5. UI & styling

- Tailwind 4 utilities; tokens (colors, radius, fonts) defined in `app/globals.css` via `@theme`. Use tokens, not raw hex.
- `cn()` (`lib/utils.ts`) to merge classes. Variants via a `variant`/`size` prop map (cva optional) — as in `Button.tsx`.
- Icons: `lucide-react` only. Images: `next/image` with width/height; fonts: `next/font`.
- Mobile-first; breakpoints `sm md lg xl`. Min touch target 40px. Don't build desktop-only layouts.
- Accessibility: semantic elements, labels for inputs, `aria-*` for modal/menus, visible focus, alt text, color contrast AA.
- Copy is Vietnamese; centralize repeated strings in `constants/`. Dates/money formatted with `Intl` (`vi-VN`, VND) in `utils/`.
- Prefer composition: small components (<150 lines), props typed with an explicit `Props` type, no prop drilling beyond 2 levels (use context or composition).

## 6. Component template

```tsx
import { cn } from '@/lib/utils';
import type { Job } from '@/types/job';

type JobCardProps = { job: Job; className?: string };

export default function JobCard({ job, className }: JobCardProps) {
  return (
    <article className={cn('rounded-lg border bg-white p-4', className)}>
      <h3 className="font-semibold">{job.title}</h3>
    </article>
  );
}
```

Client leaf: add `'use client';` as the first line, only when needed. Import via `@/` alias; imports are auto-sorted by Prettier.

## 7. Feature map (from `FUNCTION_REQUIRMENT.md`)

| Area | Routes (English) | Role |
|---|---|---|
| Public | `/`, `/jobs`, `/jobs/[slug]`, `/companies`, `/companies/[slug]`, `/blog`, `/faq` | Guest+ |
| Auth | `/login`, `/register`, `/forgot-password`, `/reset-password` | Guest |
| Candidate | `/candidate/dashboard`, `/candidate/profile`, `/candidate/cvs`, `/candidate/saved-jobs`, `/candidate/applications`, `/candidate/job-alerts`, `/candidate/ai/*` (cv-feedback, mock-interview, cover-letter) | Candidate |
| Account | `/account/security`, `/account/devices`, `/account/two-factor`, `/account/verification` | any logged in |
| Recruiter | `/recruiter/jobs`, `/recruiter/applications`, `/recruiter/company` | Recruiter |
| Admin | `/admin/*` | Admin |

## 8. Performance & quality

- Lazy-load heavy client widgets (`next/dynamic`) — map, rich-text editor, charts, PDF viewer.
- Debounce search inputs (300 ms); keep filters in URL.
- Avoid `useEffect` for data fetching; avoid premature `useMemo/useCallback` (React Compiler can be enabled later).
- Don't leak secrets: only `NEXT_PUBLIC_*` reaches the browser. Sanitize any HTML from the backend/AI (blog, JD) before `dangerouslySetInnerHTML` — prefer a markdown renderer.
- Tests (add when the team agrees): Vitest + Testing Library for components/hooks, Playwright for critical flows (login, search, apply).

## 9. Differences from the MapLearn reference

| MapLearn | InterVue | Why |
|---|---|---|
| Next 15, `src/` dir, Redux Toolkit + Axios | Next 16, no `src/`, React Query + thin client, Zustand if needed | Newer framework, less boilerplate |
| Roles: student/teacher/admin | Candidate/Recruiter/Admin, multi-role | Product |
| Mostly client-side SPA feel | Server Components for SEO pages (job/company/blog) | Search traffic matters for a job board |
| Tokens in localStorage/cookies by client | Access token in memory + HttpOnly refresh cookie | Reduces XSS token theft |
| shadcn/Radix | Own `components/ui` now; adopt shadcn/Radix for complex widgets (dialog, select, popover) when needed | Keep consistent, avoid duplicating |
| Pusher, Gemini in the web app | AI & realtime calls go through the backend | Keys stay server-side, auditing |

## 10. Checklist: add a page

1. Route in the right group, English kebab-case; `loading.tsx` / `error.tsx` where useful; `generateMetadata` for public pages.
2. Types in `types/`, API in `apiRequest/`, hook in `hooks/` (if client), schema in `schemas/` (if form).
3. Compose from `components/ui` + feature components; handle loading/empty/error; check at 375px width.
4. Use mocks only if the endpoint doesn't exist; mark file `// TEMP: replace with API`.
5. `npm run lint && npm run build`.
