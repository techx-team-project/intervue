# API Contract (Backend ⇄ Frontend)

Single source of truth for the HTTP contract. Update this file in the **same PR** that changes an endpoint.
Until OpenAPI (springdoc) is adopted, list endpoints here.

## Envelope

```ts
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  error: { code: string; details: { field?: string; message: string }[]; meta?: Record<string, unknown> } | null;
  traceId: string;
  timestamp: string; // ISO-8601 UTC
};
type Page<T> = { items: T[]; page: number; size: number; totalItems: number; totalPages: number };
```

- Base URL: `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:8080/api/v1`).
- Pagination query: `?page=0&size=20&sort=<property>,<asc|desc>`. `page` is 0-based, `size` defaults to 20 and is capped at 100. Each endpoint whitelists the properties it can sort by; anything else is `VALIDATION_FAILED` on field `sort`.
- Auth: `Authorization: Bearer <accessToken>`; refresh token is an HttpOnly cookie → frontend requests use `credentials: 'include'`.
- Frontend branches on `error.code`, never on `message`.
- CORS: `/api/**` allows only the origin in `app.frontend-url` (`FRONTEND_URL`), with credentials, methods `GET POST PUT PATCH DELETE OPTIONS`, headers `Authorization Content-Type Accept`, and exposes `Retry-After`.
- Expired or invalid access tokens are rejected with HTTP 401 (`error.code` may be `UNAUTHORIZED` or `UNAUTHENTICATED`); the frontend refreshes on the status code, not the code.

## Endpoints

| Status | Method & path | Auth | Request | Response `data` |
|---|---|---|---|---|
| ✅ | `POST /auth/register` | public | `{ name, email, password, confirmPassword, acceptTerms }` | `{ accessToken, user }` + refresh cookie; sends verification email |
| ✅ | `POST /auth/login` | public | `{ email, password }` | `{ accessToken, user }` + cookie. Failure: `INVALID_CREDENTIALS` with `error.meta.captchaRequired`, or `ACCOUNT_BANNED` once the password is correct |
| ✅ | `POST /auth/refresh` | cookie | – | `{ accessToken, user }` (rotates cookie) |
| ✅ | `POST /auth/logout` | user | – | – (clears cookie, blacklists access token) |
| ✅ | `POST /auth/verify-email` | public | `{ token }` | – (link valid 24h, single use) |
| ✅ | `POST /auth/resend-verification` | user | – | – (60s cooldown, 3 per 15 min by email and IP) |
| ✅ | `POST /auth/forgot-password` | public | `{ email }` | – (same message whether or not the email exists; 60s cooldown, 3 per 15 min by email and IP) |
| ✅ | `POST /auth/reset-password` | public | `{ token, password, confirmPassword }` | – (link valid 15 min, single use; logs out all devices) |
| ✅ | `GET /users/me` | user | – | `UserResource` `{ id, email, name, phone?, emailVerified, roles, createdAt }` |
| ✅ | `POST /users/me/roles/recruiter` | user | – | `UserResource` with `RECRUITER` in `roles`. `EMAIL_NOT_VERIFIED` if the email is not verified. Idempotent when already a recruiter. Evicts the user's session cache after commit: call `POST /auth/refresh` (or let the next 401 trigger it) to rebuild the session and receive the new `user.roles`. ADMIN can never be self-assigned (no endpoint). |
| ✅ | `GET /admin/users` | admin | query `q`, `role`, `status`, `emailVerified` + pagination | `PageResource<AdminUserListResource>` |
| ✅ | `GET /admin/users/summary` | admin | – | `AdminUserSummaryResource` |
| ✅ | `GET /admin/users/{id}` | admin | – | `AdminUserDetailResource` |
| ✅ | `POST /admin/users/{id}/ban` | admin | `{ reason, detail?, notifyUser, expiresAt? }` | `AdminUserDetailResource` (revokes every session) |
| ✅ | `POST /admin/users/{id}/unban` | admin | `{ reason? }` | `AdminUserDetailResource` |
| ✅ | `GET /admin/users/{id}/activity` | admin | pagination | `PageResource<AdminUserActivityResource>` |
| ✅ | `GET /admin/audit-log` | admin | query `actorType`, `action`, `targetType`, `targetId`, `from`, `to`, `q` + pagination | `PageResource<AdminAuditLogResource>` |
| ✅ | `GET /admin/users/{id}/sessions` | admin | – | `List<AdminUserSessionResource>` |
| ✅ | `DELETE /admin/users/{id}/sessions/{sessionId}` | admin | – | – (revokes specific session) |
| ✅ | `POST /admin/users/{id}/sessions/revoke-all` | admin | – | – (logs out all devices and evicts session cache) |
| ✅ | `GET /admin/users/{id}/sign-ins` | admin | pagination | `PageResource<AdminUserSignInResource>` |

Add rows as endpoints are built. Keep ✅ = implemented, ⬜ = planned.

## Admin user management

Everything under `/admin/**` requires `ROLE_ADMIN`; a signed-in non-admin gets 403 `FORBIDDEN`.

```ts
type AdminUserRoleGrant = { role: RoleType; grantedAt: string; grantedByName: string | null; expiresAt: string | null };
type AdminUserRestriction = {
  kind: 'BAN'; reason: string; detail: string | null;
  at: string; byName: string | null; expiresAt: string | null;
};
type AdminUserListResource = {
  id: number; name: string; email: string; phone: string | null; image: string | null;
  status: 'ACTIVE' | 'BANNED'; emailVerifiedAt: string | null;
  roles: AdminUserRoleGrant[]; activeSessionCount: number; hasTokenReuseIncident: boolean;
  createdAt: string; lastSignInAt: string | null; restriction: AdminUserRestriction | null;
};
type AdminUserDetailResource = AdminUserListResource & {
  address: string | null; termsAcceptedAt: string | null; updatedAt: string;
};
type AdminUserSummaryResource = {
  total: number; active: number; banned: number; unverified: number;
  newLast7Days: number; activeLast7Days: number;
  candidates: number; recruiters: number; admins: number;
  activeAdminCount: number;
  bannedOverAWeek: number; unverifiedOverAWeek: number; grantsExpiringIn14Days: number;
};
type AdminUserActivityResource = {
  id: number; kind: string; summary: string; actorName: string | null;
  reason: string | null; at: string;
};
type AdminUserSessionResource = {
  id: number; createdAt: string; expiresAt: string; revoked: boolean;
  replacedByTokenId: number | null; deviceLabel: string; ipAddress: string; isCurrent: boolean;
};
type AdminUserSignInResource = {
  id: number; at: string; deviceLabel: string; ipAddress: string;
  location: string; outcome: 'success' | 'revoked';
};
type AdminAuditLogResource = {
  id: number; actorType: 'ADMIN' | 'SYSTEM' | 'USER'; actorId: number | null;
  actorEmail: string | null; actorName: string; actorRoleLabel: string;
  action: string; targetType: string; targetId: number | null; targetLabel: string;
  reason: string | null; detail: string | null; ip: string | null;
  traceId: string | null; createdAt: string;
};
```

- `GET /admin/users` filters: `q` matches name, email, phone or numeric id (max 100 chars); `role` and `status` take a single enum value; `emailVerified` is a boolean. Sortable properties: `id`, `createdAt`, `name`, `email`, `status`, `lastLoginAt`. The primary key is always appended as a tie-breaker, so paging never repeats or skips a row.
- `activeAdminCount` exists so the panel can keep the "cannot restrict the last active admin" guardrail while paging server-side.
- `GET /admin/users/{id}` returns 404 `NOT_FOUND` for an unknown id.

Ban takes a required `reason`, an optional free-text `detail` (max 500), `notifyUser`, and an optional `expiresAt` that must be in the future — omit it for an open-ended ban. An account holds at most one standing restriction: lift the current one before applying another. Banning revokes every refresh token and drops the Redis session entry, so the account is signed out on its next request rather than when its access token expires. Unbanning does not re-issue anything; the user signs in fresh.

`notifyUser` emails the account holder the reason and, for a temporary ban, the date it lifts. The matching lift is emailed too — whether an admin unbans or the restriction expires on its own — so an account that was told it was restricted is also told when it is usable again. Mail goes out asynchronously after the transaction commits and a delivery failure is logged without failing the request.

A ban with an `expiresAt` lifts itself: a sweep runs every 5 minutes and clears the restriction once it is past, recording the lift against a `SYSTEM` actor rather than an admin. Sign-in stops being refused the moment `expiresAt` passes, so `status` can read `BANNED` for up to one sweep interval after the account is usable again.

`restriction.kind` is `BAN` today. A second kind — a reversible security hold, distinct from policy enforcement — is planned but not implemented, so `status` only ever returns `ACTIVE` or `BANNED`.

- `GET /admin/users/{id}/activity` returns paged events for the specified account, mapped from audit logs and ordered newest first (`createdAt DESC, id DESC`). Unknown `id` returns 404 `NOT_FOUND`.
- `GET /admin/audit-log` (also accessible via `/admin/audit-logs` and `/admin/users/audit-log`) returns system-wide paged audit records with optional filters (`actorType`, `action`, `targetType`, `targetId`, `from`, `to`, `q` search).

| Code | HTTP | Meaning |
|---|---|---|
| `ACCOUNT_ALREADY_RESTRICTED` | 409 | The account already has a standing ban |
| `ACCOUNT_NOT_RESTRICTED` | 409 | No standing restriction to lift |
| `CANNOT_RESTRICT_SELF` | 422 | An admin cannot ban their own account |
| `LAST_ACTIVE_ADMIN` | 422 | The target is the only active admin left |

## Error codes

| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_FAILED` | 400 | See `error.details[{ field, message }]` |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password; `error.meta.captchaRequired` is true after 3 failures |
| `INVALID_OR_EXPIRED_TOKEN` | 400 | Verification or reset link is invalid, expired or already used |
| `EMAIL_ALREADY_VERIFIED` | 409 | |
| `EMAIL_NOT_VERIFIED` | 422 | The action requires a verified email (e.g. enabling the Recruiter role) |
| `UNAUTHENTICATED` | 401 | Missing/expired token → frontend tries refresh once |
| `FORBIDDEN` | 403 | Role/ownership failure |
| `NOT_FOUND` | 404 | |
| `EMAIL_ALREADY_USED` | 409 | |
| `ACCOUNT_BANNED` | 403 | The account is banned, so signing in and refreshing are both refused. Only raised after the password matches, so it never reveals the state of an account to someone who does not hold its credentials |
| `IDENTITY_NOT_VERIFIED` | 422 | Candidate must complete eKYC to apply |
| `COMPANY_NOT_VERIFIED` | 422 | Company must be verified to post |
| `RATE_LIMITED` | 429 | Honor `Retry-After` |
