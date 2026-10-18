# Report: Candidate Authentication (Frontend) + CORS

Branch: `feat/auth-candidate-frontend` (from `dev`). Nothing has been committed yet.

## 1. Scope

Integrate the existing backend authentication API into the Next.js frontend for the **Candidate** role, set up a proper base for storing the session, and enable CORS on the backend so the browser can call the API with credentials.

All auth-related UI copy is in **English** (as requested for this work).

## 2. Folder structure

Follows `docs/ai/frontend-guide.md`, which is the project adaptation of `maplearn-platform-web-nextjs` (route groups, `apiRequest/`, `hooks/`, `schemas/`, `store/`, `providers/`, `config/`, `constants/`). The project keeps no `src/` directory (a documented deviation), so folders stay at the frontend root.

```
frontend/
├─ proxy.ts                         Next 16 route guard (refresh-cookie presence)
├─ .env.example                     NEXT_PUBLIC_API_URL
├─ app/
│  ├─ (auth)/                       login · register · forgot-password · reset-password · verify-email
│  ├─ (candidate)/                  layout = <RequireAuth roles=[CANDIDATE]>; candidate/profile
│  └─ account/layout.tsx            wrapped in <RequireAuth>
├─ apiRequest/   http.ts · auth.ts
├─ config/       env.ts (Zod-validated NEXT_PUBLIC_API_URL)
├─ constants/    auth.ts · routes.ts · error-messages.ts
├─ hooks/        useAuth · useLogin · useRegister · useLogout · useForgotPassword
│                useResetPassword · useVerifyEmail · useResendVerification
├─ lib/          api-error.ts · query-client.ts
├─ providers/    AppProviders · QueryProvider · AuthProvider
├─ schemas/      auth.schema.ts (matches backend validation)
├─ store/        auth.store.ts (Zustand)
├─ types/        api.ts · auth.ts
├─ utils/        error.ts · redirect.ts
└─ components/
   ├─ auth/      LoginForm · RegisterForm · ForgotPasswordForm · ResetPasswordForm · VerifyEmailStatus
   │             GuestRedirect · RequireAuth · EmailVerificationBanner · InvalidLinkNotice · FormErrorAlert
   ├─ ui/        PasswordInput (new, reused by all password fields)
   └─ common/    Spinner · header/HeaderAccountActions
```

Route changes (no mass rename):
- `app/login`, `register`, `forgot-password` moved into the `(auth)` group (URLs unchanged); `reset-password` and `verify-email` added (the backend emails link to them).
- `app/auth` removed; `/auth` redirects to `/login` in `next.config.ts`.
- `app/profile` and `app/candidate/profile` merged into `app/(candidate)/candidate/profile`; `/profile` redirects to `/candidate/profile`. Links updated.
- `AuthPageView` (client-side mode switching with `history.replaceState`) removed; each screen is now a real route.

## 3. Session storage design

| Item | Where | Why |
|---|---|---|
| Access token (JWT, 15 min) | Memory only (Zustand store, not persisted) | Not readable after XSS persistence; never in `localStorage` |
| Refresh token | HttpOnly cookie set by the backend | JS can never read it |
| User + status | Zustand store (`idle → loading → authenticated / unauthenticated`) | Single source of truth for UI |

Flow:
1. `AuthProvider` calls `POST /auth/refresh` once on app start (cookie → new access token + user), so a reload keeps the session.
2. `apiRequest/http.ts` is the only code that calls `fetch`: base URL from `NEXT_PUBLIC_API_URL`, `credentials: 'include'`, Bearer header, envelope unwrapping, typed `ApiError { status, code, message, details, meta, traceId, retryAfter }`.
3. On HTTP 401 it refreshes **once** (single-flight promise shared by concurrent requests, which also protects the rotating refresh token from being reused) and retries; if refresh fails the session is cleared and guards redirect to `/login?redirect=...`.
4. Logout calls `POST /auth/logout` then does a full page reload to `/login`, dropping every in-memory token and cache.
5. Redirect targets are sanitized (same-origin paths only) to prevent open redirects.

Route protection has three layers: `proxy.ts` (optimistic redirect when the refresh cookie is missing, for `/candidate/*` and `/account/*`), client guards (`RequireAuth`, `GuestRedirect`), and the backend (real enforcement).

## 4. Features delivered

- Register (name, email, password, confirm, accept terms), auto sign-in, verification email notice
- Login with field/root errors from the API
- Forgot password with 60 s resend cooldown; Reset password (token from email link)
- Verify email page (single-use token guarded against the Strict Mode double effect) and a banner with "Resend email" for unverified users
- Header: guest sees Sign in / Sign up; signed-in user sees real name, email, id, and working Sign out (desktop menu, mobile drawer, account sidebar)
- Forms use React Hook Form + Zod; server `details[].field` errors map back onto fields

## 5. Backend change: CORS

- New `config/CorsConfig.java`: origin from `app.frontend-url` (`FRONTEND_URL`), `allowCredentials=true`, methods `GET POST PUT PATCH DELETE OPTIONS`, headers `Authorization Content-Type Accept`, exposes `Retry-After`, preflight cached 1 h, applied to `/api/**`.
- `SecurityConfig`: `.cors(Customizer.withDefaults())` so preflight is answered before JWT filtering.

## 6. Dependencies

Added: `@tanstack/react-query`, `react-hook-form`, `@hookform/resolvers`, `zustand`, `sonner` (all prescribed by `frontend-guide.md`).
Upgraded: `next` 16.3.5 → 16.4.2, `eslint-config-next` → 16.4.2, `react`/`react-dom` 19.2.8 → 19.3.1, `lucide-react` → 1.59, `zod` → 4.6.7, `prettier` → 3.9.10, `@types/node` 20 → 22 (matches Node 22).
Deliberately not upgraded: TypeScript 5 → 7 and ESLint 9 → 10 (major jumps with tooling compatibility risk).

## 7. Documentation updated

- `docs/ai/api-contract.md`: removed stale `confirmAge`, corrected the error shape (`details[]`, `meta`), documented CORS and the 401 behavior.
- `docs/ai/frontend-guide.md`: documented the session store, guards and proxy scope.

## 8. Verification

- `npx tsc --noEmit`: pass
- `npm run lint`: 0 errors (28 pre-existing `<img>` warnings)
- `npm run build`: pass
- Backend `./mvnw compile` + `spotless:apply`: pass
- Live backend checks: see section 10

## 9. Things to know

- **Cookie attributes**: the backend sets `Secure; SameSite=Strict`. This works on `localhost` (ports do not matter for "same site"). For production, frontend and API must share a registrable domain (e.g. `app.x.com` / `api.x.com`); otherwise the proxy cannot see the cookie and the cookie would need `SameSite=None`. Safari does not accept `Secure` cookies over plain `http://localhost`.
- **Register form**: the old "phone" field was removed because `RegisterRequest` does not accept it; the terms checkbox is no longer pre-checked.
- **Backend inconsistency (not changed)**: the JWT filter returns error code `UNAUTHORIZED` while the exception handler returns `UNAUTHENTICATED`; the frontend refreshes on HTTP 401 so both work.
- **Social buttons** are still non-functional placeholders (no backend support).
- Only auth-related screens were translated to English; the rest of the site is still Vietnamese. Existing, unrelated `AccountPasswordView` still uses Vietnamese copy.
- `frontend/.env.local` was created locally (git-ignored) so the build works; teammates copy `.env.example`.
- Unrelated working-tree changes by you (`AuthMailListener.java`, `RegisterRequest.java`) were left untouched and must be committed separately.
- Prettier re-saved some untouched files with LF line endings (the repo is checked out with CRLF); these show as modified in `git status` without real content changes.

## 10. Live test results

See the end of this file (appended after the run).

### Results (backend running locally, curl with `Origin: http://localhost:3000`)

| Check | Result |
|---|---|
| Preflight `OPTIONS /auth/login` from `http://localhost:3000` | 200, `Allow-Origin` echoes the origin, `Allow-Credentials: true`, `Expose-Headers: Retry-After` |
| Preflight from `http://evil.com` | 403, no CORS headers |
| `POST /auth/register` | 200 with `accessToken` + `Set-Cookie: refresh_token; HttpOnly; Secure; SameSite=Strict` and CORS headers |
| `POST /auth/login` wrong password | 401 `INVALID_CREDENTIALS` with `details: []` and `meta.captchaRequired` |
| `POST /auth/login` correct password | 200 with session |
| `POST /auth/refresh` with cookie | 200, new access token (cookie rotated) |

Not covered: the UI was not exercised in a real browser during this task, and verify-email / reset-password need a real mailbox. A test account `e2e.tester1@example.com` was created in your local dev database.
