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
| ✅ | `POST /auth/oauth/{provider}/authorize` | public | `OAuthAuthorizeRequest` `{ intent: "LOGIN" \| "REGISTER", acceptTerms? }` (`provider`: `google`; `acceptTerms` optional, default `false`) | `{ authorizationUrl }` ("Redirecting to Google...") and sets the HttpOnly `oauth_state_nonce` cookie (path `/api/v1/auth/oauth`, 5 min) that binds the flow to this browser. `REGISTER` without `acceptTerms=true` → `VALIDATION_FAILED` on `acceptTerms`. Errors: `NOT_FOUND` (unknown provider), `OAUTH_NOT_CONFIGURED` 503, `RATE_LIMITED` 429 with `Retry-After` (20 per 10 min per IP) |
| ✅ | `POST /auth/oauth/{provider}` | public | `OAuthCallbackRequest` `{ code, state }`; requires the `oauth_state_nonce` cookie set by the authorize call (send with credentials) | Same as `POST /auth/login` (`{ accessToken, user }` + refresh cookie, or the 2FA challenge) ("Logged in successfully!"); once the body is valid, the nonce cookie is always cleared. Errors: `OAUTH_STATE_INVALID` 400 (unknown, expired or reused `state`, missing or different nonce cookie), `OAUTH_PROVIDER_ERROR` 502, `OAUTH_NOT_CONFIGURED` 503, `OAUTH_EMAIL_UNVERIFIED` 422, `OAUTH_LINK_REQUIRES_VERIFIED_EMAIL` 409, `OAUTH_ACCOUNT_NOT_FOUND` 404, `SOCIAL_LOGIN_NOT_ALLOWED` 403, plus the login errors `ACCOUNT_BANNED` / `ACCOUNT_DELETED` |
| ✅ | `POST /auth/refresh` | cookie | – | `{ accessToken, user }` (rotates cookie) |
| ✅ | `POST /auth/logout` | user | – | – (clears cookie, blacklists access token; recruiter tokens get 403) |
| ✅ | `POST /auth/verify-email` | public | `{ token }` | – (link valid 24h, single use) |
| ✅ | `POST /auth/resend-verification` | user | – | – (60s cooldown, 3 per 15 min by email and IP; recruiter tokens get 403) |
| ✅ | `POST /auth/forgot-password` | public | `{ email }` | – (same message whether or not the email exists; 60s cooldown, 3 per 15 min by email and IP) |
| ✅ | `POST /auth/reset-password` | public | `{ token, password, confirmPassword }` | – (link valid 15 min, single use; logs out all devices) |
| ✅ | `GET /users/me` | user | – | `UserResource` `{ id, email, name, phone?, emailVerified, hasPassword, roles, createdAt }` (`hasPassword` is `false` for an account created with Google that never set a password) |
| ✅ | `POST /ai/chat` | public / optional user | `{ message, sessionId? }` | `{ answer, sources, remainingQuota }` |
| ✅ | `POST /ai/resume-match` | public / recruiter / user | `{ applicationId?, jobTitle, jobRequirements, jobDescription?, candidateData?, cvText? }` | `ResumeMatchResult` `{ applicationId, experienceSummary, requirements, questionsToAsk, model, promptVersion, aiProcessedCandidateData, analyzedAt, disclaimer }` (Runs async; sensitive PII/KYC and screening questions strictly stripped) |
| ✅ | `POST /ai/cv-reviews` | candidate | `{ resumeId?, cvText?, targetPosition? }` | `CvReviewResult` `{ fileHash, overallScore, summary, comments: [{ section, quote, problem, fix }], modelVersion, promptVersion, fromCache }` (3 uses/day, resets 00:00 VN time; unchanged CV returns cached result without using quota) |
| ✅ | `POST /ai/cover-letter` | candidate / user | `{ jobTitle, companyName, jobRequirements?, jobDescription?, resumeId?, cvText?, candidateName? }` | `CoverLetterGenerateResult` `{ coverLetter, modelVersion, promptVersion, notice }` (Fact-only draft from CV and job; user edits before sending; never sent automatically) |
| ✅ | `POST /ai/cv-reviews/upload` | candidate | multipart `file`, `targetPosition?` | `CvReviewResult` (PDF upload; unreadable detected with clear reason; cached by hash) |
| ✅ | `GET /ai/cv-reviews/quota` | candidate | – | `CvReviewQuotaResource` `{ usedToday, remaining, maxDaily, resetAt }` |
| ✅ | `GET /ai/cv-reviews/{id}` | candidate | – | `CvReviewResult` (strictly accessible only by candidate owner) |
| ✅ | `GET /ai/cv-reviews` | candidate | – | `List<CvReviewResult>` (review history for authenticated candidate) |
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
| ✅ | `POST /admin/users/{id}/roles` | admin | `{ role, expiresAt?, reason? }` | `AdminUserDetailResource` (grants role; evicts session cache; 409 if already active; granting `ADMIN` to an account without a password → `PASSWORD_NOT_SET` 422) |
| ✅ | `DELETE /admin/users/{id}/roles/{role}` | admin | `{ reason? }` | `AdminUserDetailResource` (revokes role; evicts session cache; guards last role & self admin) |
| ✅ | `POST /admin/users/{id}/reset-two-factor` | admin | – | `AdminUserDetailResource` (clears authenticator secret and backup codes) |
| ✅ | `POST /admin/users/{id}/send-password-reset` | admin | – | `AdminUserDetailResource` (sends a single-use 15-minute reset link; requires verified email) |
| ✅ | `POST /users/me/delete-request` | user | – | – (starts 7-day grace period, sets status PENDING_DELETION, evicts session) |
| ✅ | `POST /users/me/cancel-deletion` | user | – | `UserResource` (cancels pending deletion) |
| ✅ | `POST /users/me/email/change-request` | user | `ChangeEmailRequest` (`newEmail`, `currentPassword`) | – (`PASSWORD_NOT_SET` 422 when the account has no password; mails a confirmation link to the new email and a notice to the old one; field errors on `currentPassword` / `newEmail` (same as current email); `EMAIL_ALREADY_USED` for an email already in `users`; `RATE_LIMITED` 429 with `Retry-After`: 3 attempts per 15 min per account, and mails limited like resend-verification (60s cooldown, 3 per 15 min by email and IP) only when a mail is actually sent; the confirmation link is bound to the requested new email) |
| ✅ | `POST /auth/confirm-email-change` | public | `VerifyEmailRequest` (`token`) | – (sets the new email, marks it verified, signs out every device; link `{frontendUrl}/confirm-email-change?token=…` valid 24h, single use; `INVALID_OR_EXPIRED_TOKEN`, `EMAIL_ALREADY_USED` if the email was taken meanwhile) |
| ✅ | `POST /users/me/change-password` | user | `ChangePasswordRequest` (`currentPassword`, `password`, `confirmPassword`; `currentPassword` is ignored and optional when `hasPassword=false`, which sets the first password, and required otherwise) | – (signs out every other device, evicts session cache; field errors on `currentPassword` / `password` / `confirmPassword`; `RATE_LIMITED` 429 with `Retry-After` after 3 attempts per 15 min) |
| ✅ | `GET /users/me/sessions` | user | – | `AccountSessionResource[] { id, deviceLabel, ipAddress, location?, createdAt, lastUsedAt, current }` (`current` marks the device making the request) |
| ✅ | `DELETE /users/me/sessions/{sessionId}` | user | – | – (signs out one device; the current session cannot be revoked here, use logout (`VALIDATION_FAILED` on `sessionId`); `NOT_FOUND` for another user's session) |
| ✅ | `POST /users/me/sessions/revoke-others` | user | – | – (signs out every other device; like change-password and `DELETE /users/me/sessions/{id}`, only refresh tokens are revoked, so an access token the device already holds keeps working until it expires, up to 15 min) |
| ✅ | `POST /admin/users/{id}/cancel-deletion` | admin | – | `AdminUserDetailResource` (cancels deletion request) |
| ✅ | `POST /admin/users/{id}/restore` | admin | – | `AdminUserDetailResource` (restores account from PENDING_DELETION or lifts BANNED) |

Add rows as endpoints are built. Keep ✅ = implemented, ⬜ = planned.

## Candidate profile

Owner-only; everything under `/candidate/profile` requires `ROLE_CANDIDATE` (a signed-in non-candidate gets 403 `FORBIDDEN`). `UserResource` also carries optional `address`.

| Status | Method & path | Auth | Request | Response `data` |
|---|---|---|---|---|
| ✅ | `GET /candidate/profile` | candidate | – | `CandidateProfileResource`. Read-only: when no profile row exists yet, returns the user data with defaults (`jobSearchStatus` `OPEN_TO_OFFERS`, `searchableByRecruiters` true, `desiredRole` null) without writing |
| ✅ | `PUT /candidate/profile` | candidate | `SaveCandidateProfileRequest` (full replace; creates the row on first call) | `CandidateProfileResource` |
| ✅ | `POST /candidate/profile/avatar` | candidate | multipart `file` (JPEG/PNG) | `CandidateProfileResource` (replaces and deletes the previous image) |
| ✅ | `DELETE /candidate/profile/avatar` | candidate | – | `CandidateProfileResource` |
| ✅ | `POST /candidate/profile/cover` | candidate | multipart `file` (JPEG/PNG) | `CandidateProfileResource` |
| ✅ | `DELETE /candidate/profile/cover` | candidate | – | `CandidateProfileResource` |
| ✅ | `POST /candidate/profile/{section}` | candidate | `SaveCandidate<Section>Request` | `CandidateProfileResource` (creates the profile row on the first item; max items reached gives 409 `PROFILE_SECTION_LIMIT_REACHED`) |
| ✅ | `PUT /candidate/profile/{section}/{id}` | candidate | `SaveCandidate<Section>Request` (full replace) | `CandidateProfileResource` (an id that is not yours gives 404 `NOT_FOUND`) |
| ✅ | `DELETE /candidate/profile/{section}/{id}` | candidate | – | `CandidateProfileResource` |
| ✅ | `POST /candidate/profile/certifications/{id}/image` | candidate | multipart `file` (JPEG/PNG) | `CandidateProfileResource` (replaces and deletes the previous image) |
| ✅ | `DELETE /candidate/profile/certifications/{id}/image` | candidate | – | `CandidateProfileResource` |

`SaveCandidateProfileRequest`: `name` (2-50 after trimming, required, stored on the user), `headline` (max 120), `bio` (max 2000), `contactEmail` (email, max 255; null = use the login email), `address` (max 255, stored on the user), `gender` (`MALE` `FEMALE` `OTHER`), `birthYear` (1950 to current year minus 16), `showPersonalDetails` (required boolean; birth year and gender visible to recruiters), `searchableByRecruiters` (required boolean), `jobSearchStatus` (required: `ACTIVELY_LOOKING` `OPEN_TO_OFFERS` `NOT_LOOKING`), `githubUrl` / `linkedinUrl` / `portfolioUrl` (empty or http/https URL, max 255), `desiredRole` (required, 1-120 after trimming), `desiredLevel` (`INTERN` `JUNIOR` `MID` `SENIOR` `LEAD`), `salaryNegotiable` (required boolean), `salaryMin` / `salaryMax` (>= 0, min <= max; stored null when negotiable), `workMode` (`ON_SITE` `HYBRID` `REMOTE` `FLEXIBLE`), `contractType` (`FULL_TIME` `PART_TIME` `INTERNSHIP`), `preferredLocations` / `preferredIndustries` (max 5 each in the raw list, 1-100 chars each; the server trims, drops blanks and silently merges duplicates that compare equal ignoring case, accents and width, keeping the first spelling; responses list them sorted case-insensitively). Cross-field failures are reported on the properties `birthYearAllowed`, `salaryRangeValid`, `nameLengthValid`, `desiredRoleLengthValid`.

`CandidateProfileResource`: `userId, name, email, contactEmail, phone, phoneVerified, address, avatarUrl, coverUrl, headline, bio, gender, birthYear, showPersonalDetails, searchableByRecruiters, jobSearchStatus, githubUrl, linkedinUrl, portfolioUrl, desiredRole, desiredLevel, salaryNegotiable, salaryMin, salaryMax, workMode, contractType, preferredLocations, preferredIndustries, experiences, educations, projects, certifications, languages, skills, updatedAt`. `phone` and `phoneVerified` are read-only here; change the phone through `/users/me/phone/*`.
Upload errors for avatar, cover and certification image: `UNSUPPORTED_FILE_TYPE` (400), `FILE_TOO_LARGE` (400), `STORAGE_UNAVAILABLE` (503).

Profile sections (`{section}` is `experiences` (max 20), `educations` (max 10), `projects` (max 20), `certifications` (max 20), `languages` (max 10) or `skills` (max 50)). Every write returns the full `CandidateProfileResource`, which also carries the lists `experiences, educations, projects, certifications, languages, skills`. Dates are `yyyy-MM-dd` (the client sends the first day of the month); text fields marked "text" below are max 2000 characters; the server trims text and stores blanks as null.

- `SaveCandidateExperienceRequest`: `title` (required, max 120), `companyName` (required, max 150), `location` (max 100), `startDate` (required), `endDate`, `current` (required boolean; `endDate` must be empty when true), `description` (text), `achievements` (text), `skills` (max 15 in the raw list, 1-60 chars each; trimmed, blanks dropped, case/accent-insensitive duplicates merged). Cross-field failure on property `dateRangeValid`. Response items: `id, title, companyName, location, startDate, endDate, current, description, achievements, skills` ordered current first, then `startDate` descending.
- `SaveCandidateEducationRequest`: `school` (required, max 150), `degree` (max 100), `major` (max 150), `startYear` (required), `endYear`, `gpa` (max 20), `achievements` (text). Years must be 1950 to current year plus 10 (property `yearBoundsValid`); `endYear` >= `startYear` (property `yearRangeValid`). Response items: `id, school, degree, major, startYear, endYear, gpa, achievements` ordered by `startYear` descending.
- `SaveCandidateProjectRequest`: `name` (required, max 150), `role` (max 100), `startDate` (required), `endDate`, `current` (required boolean), `description` (text), `highlights` (text), `githubUrl` / `demoUrl` (empty or http/https URL, max 255), `technologies` (same rules as experience `skills`). Cross-field failure on property `dateRangeValid`. Response items: `id, name, role, startDate, endDate, current, description, highlights, githubUrl, demoUrl, technologies`, ordered like experiences.
- `SaveCandidateCertificationRequest`: `name` (required, max 150), `issuer` (required, max 150), `issueDate`, `credentialId` (max 100), `credentialUrl` (empty or http/https URL, max 255). Response items: `id, name, issuer, issueDate, credentialId, credentialUrl, imageUrl`, ordered by `issueDate` descending, undated last. Deleting a certification also discards its image.
- `SaveCandidateLanguageRequest`: `language` (required, max 60), `proficiency` (required: `BASIC` `INTERMEDIATE` `ADVANCED` `FLUENT` `NATIVE`), `certificate` (max 100). A language that duplicates another one ignoring case and accents gives `VALIDATION_FAILED` on field `language`. Response items: `id, language, proficiency, certificate`, ordered by language.
- `SaveCandidateSkillRequest`: `name` (required, max 60), `category` (required: `CORE` `AI_DATA` `TOOLS_DEVOPS` `SOFT`), `level` (required: `BASIC` `INTERMEDIATE` `PROFICIENT` `EXPERT`), `years` (required, 0 to 50). A duplicate name (ignoring case and accents) gives `VALIDATION_FAILED` on field `name`. Response items: `id, name, category, level, years`, ordered by name.

## Social sign-in (candidate)

Google only (`provider = google`); LinkedIn is not implemented. Flow: `POST /auth/oauth/google/authorize` returns the Google URL and sets the `oauth_state_nonce` cookie, the browser returns to `{frontend}/auth/callback/google?code&state`, the frontend posts `{ code, state }` (with credentials) to `POST /auth/oauth/google`. Sign-up through Google requires `acceptTerms=true` at the authorize step. The Google email counts as verified only when `email_verified` is true and the address ends with `@gmail.com` or the Google account has a hosted domain (`hd`); otherwise `OAUTH_EMAIL_UNVERIFIED` (also for emails longer than 100 characters). An existing account is linked automatically only when its own email is already verified (otherwise `OAUTH_LINK_REQUIRES_VERIFIED_EMAIL`); linking is audited and notifies the owner ("Google sign-in was linked to your account."). Accounts created this way have no password (`hasPassword=false`) until the user sets one; change email, disabling 2FA and being granted `ADMIN` need a password (`PASSWORD_NOT_SET`). Accounts holding `ADMIN` are refused (`SOCIAL_LOGIN_NOT_ALLOWED`). 2FA applies exactly as for `/auth/login`.

## Admin user management

Everything under `/admin/**` requires `ROLE_ADMIN`; a signed-in non-admin gets 403 `FORBIDDEN`.

```ts
type AdminUserRoleGrant = { role: RoleType; grantedAt: string; grantedByName: string | null; expiresAt: string | null };
type AdminUserRestriction = {
  kind: 'BAN'; reason: string; detail: string | null;
  at: string; byName: string | null; expiresAt: string | null;
};
type AdminUserStatus = 'ACTIVE' | 'BANNED' | 'PENDING_DELETION' | 'DELETED';
type AdminUserListResource = {
  id: number; name: string; email: string; phone: string | null; image: string | null;
  status: AdminUserStatus; emailVerifiedAt: string | null;
  roles: AdminUserRoleGrant[]; activeSessionCount: number; hasTokenReuseIncident: boolean; twoFactorEnabled: boolean;
  createdAt: string; lastSignInAt: string | null; deleteRequestedAt: string | null; restriction: AdminUserRestriction | null;
};
type AdminUserDetailResource = AdminUserListResource & {
  address: string | null; termsAcceptedAt: string | null; updatedAt: string;
};
type AdminUserSummaryResource = {
  total: number; active: number; banned: number; unverified: number;
  newLast7Days: number; activeLast7Days: number;
  candidates: number; admins: number;
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

## Skills & Recruiter Jobs

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/skills?query=` | public | Suggest-as-you-type over active skills, max 20, prefix matches first. Result cached in Redis (`cache:skills:active`, 10 min) and evicted on admin writes. `SkillResource`: `{ id, name, group }`, `group` is `CORE`, `AI_DATA`, `TOOLS_DEVOPS` or `SOFT_SKILLS`. |
| `GET` | `/admin/skills?q=&group=&active=` | admin | Paged `AdminSkillResource` (`+ active, updatedAt`). |
| `POST` | `/admin/skills` | admin | Body `{ name, group }`. `409 SKILL_NAME_ALREADY_USED` (case-insensitive). |
| `PUT` | `/admin/skills/{id}` | admin | Same body. |
| `POST` | `/admin/skills/{id}/activate` · `/deactivate` | admin | Skills are never deleted; an inactive skill disappears from suggestions and cannot be attached to a job. |
| `GET` | `/recruiter/jobs?status=&q=&sort=&page=&size=` | recruiter | Own jobs only. `sort` is a Spring sort such as `updatedAt,desc`, `deadline,asc`, `salaryMax,desc`. Returns `PageResource<JobSummaryResource>`. |
| `GET` | `/recruiter/jobs/summary` | recruiter | `{ total, byStatus: { DRAFT, PUBLISHED, PAUSED, CLOSED, EXPIRED, HIDDEN_BY_ADMIN } }`. |
| `GET` | `/recruiter/jobs/{id}` | recruiter | `JobResource` (includes `hiddenReason` and `hiddenAt` while the job is hidden by an admin). `404 NOT_FOUND` for someone else's job. |
| `POST` | `/recruiter/jobs` | recruiter | Creates a `DRAFT`. Only `title` is required; everything else may be partial. `403 NOT_COMPANY_MEMBER` without a company. The company name is snapshotted on the job. |
| `PUT` | `/recruiter/jobs/{id}` | recruiter | Allowed in `DRAFT`, `PUBLISHED`, `PAUSED` (otherwise `422 JOB_NOT_EDITABLE`). A non-draft job must stay complete. |
| `POST` | `/recruiter/jobs/{id}/publish` | recruiter | `DRAFT` to `PUBLISHED`. Runs the publish gate (`assertCanPublish`) and a completeness check; incomplete jobs return `400 VALIDATION_FAILED` with the missing `fieldErrors`. |
| `POST` | `/recruiter/jobs/{id}/pause` · `/resume` · `/close` | recruiter | `PUBLISHED` to `PAUSED`, `PAUSED` to `PUBLISHED` (gate re-checked), `PUBLISHED`/`PAUSED` to `CLOSED`. Anything else is `422 INVALID_STATUS_TRANSITION`. |
| `DELETE` | `/recruiter/jobs/{id}` | recruiter | Drafts only (`422 JOB_NOT_EDITABLE` otherwise). |
| `GET` | `/admin/jobs?q=&status=&companyId=&page=&size=&sort=` | admin | `PageResource<AdminJobSummaryResource { id, title, status, companyId, companyName, level?, city?, salary, deadline?, publishedAt?, hiddenReason?, updatedAt }>`. Drafts are never listed. `q` matches title or company name. |
| `GET` | `/admin/jobs/summary` | admin | `{ total, byStatus }` over every non-draft job. |
| `GET` | `/admin/jobs/{id}` | admin | Full `JobResource`; `404` for a draft. |
| `POST` | `/admin/jobs/{id}/hide` | admin | Body `{ reason }` (required, max 500). `PUBLISHED` or `PAUSED` to `HIDDEN_BY_ADMIN`; anything else is `422 INVALID_STATUS_TRANSITION`. Stores `hiddenReason`, `hiddenAt`, writes an audit entry (`JOB_HIDDEN`) and notifies the recruiter (`JOB_HIDDEN_BY_ADMIN`, mandatory). A hidden job is not `PUBLISHED`, so it leaves public search and detail. |
| `POST` | `/admin/jobs/{id}/restore` | admin | `HIDDEN_BY_ADMIN` to `PUBLISHED`, or to `EXPIRED` when the deadline has passed. Clears the hidden fields, audits `JOB_RESTORED` and notifies the recruiter. |
| `GET` | `/jobs?q=&city=&contractType=&workingArrangement=&level=&skillIds=&salaryFrom=&currency=&page=&size=` | public | `PageResource<PublicJobSummaryResource>` of `PUBLISHED` jobs whose deadline is today or later, newest first (client sort is ignored). `q` matches title or company name; `companyId` limits to one company; `city` is an exact match; `skillIds` matches any of up to 10; `salaryFrom` keeps non-negotiable jobs whose maximum is at least that amount in `currency` (default `VND`). Item: `{ id, title, company: { id, name, logoUrl? }, level, contractType, workingArrangement, city, salary, skills, deadline, publishedAt }`. |
| `GET` | `/jobs/{id}` | public | `PublicJobResource` (summary fields plus `location`, `description`, `requirements`, `benefits`, `openings`, and `company.address`). `404 NOT_FOUND` unless the job is `PUBLISHED` and not past its deadline. Also returns `screening: { questionCount, requiredCount, estimatedMinutes }` so candidates see the effort before applying; the questions themselves are not public. |

- `SaveJobRequest`: `{ title, level, contractType, workingArrangement, location: { city, address }, salary: { negotiable, min, max, currency }, skillIds, description, requirements, benefits, deadline, openings, screeningQuestions? }`. Salary is monthly, in the minor unit of `currency` (`VND` or `USD`); `deadline` is a date in Vietnam time.
- `screeningQuestions` (optional, max 5) is a full replace: `[{ type: CHOICE | SHORT_TEXT, prompt (max 300), required, options }]`. A `CHOICE` question needs 2 to 6 different options (max 100 characters each); a `SHORT_TEXT` question takes none. Omit the field to leave the questions unchanged. Field errors use `screeningQuestions[i].options`. A job with questions has `applicationMode` `CV_AND_QUESTIONS`, otherwise `CV_ONLY`. Once the job has applications, changing the questions returns `422 SCREENING_QUESTIONS_LOCKED`. The recruiter `JobResource` returns `screeningQuestions: [{ id, type, prompt, required, options? }]`; the questions are never part of the public or AI-facing resources.
- A publish-ready job needs level, contract type, arrangement, city, at least one skill, a description of 50+ characters, requirements of 20+, a salary range (or `negotiable`) and a deadline of today or later. Field names in errors are `level`, `contractType`, `workingArrangement`, `location.city`, `skillIds`, `description`, `requirements`, `salary.min`, `salary.max`, `deadline`.
- A scheduler (daily 00:05, Asia/Ho_Chi_Minh) moves `PUBLISHED`/`PAUSED` jobs whose deadline has passed to `EXPIRED`. All transitions live in `JobStatusPolicy`.

## Candidate CVs

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/candidate/cvs` | candidate | `CandidateResumeResource[] { id, fileName, url, fileSizeBytes, contentType, isDefault, parsedSummary?, createdAt }`, newest first. `url` is the download path. |
| `POST` | `/candidate/cvs` | candidate | multipart `file`. PDF only (checked by the file signature, not the extension) and max 5 MB; the file is not parsed on upload, so page count and passwords are not checked. A rejected file returns `400 VALIDATION_FAILED` on field `file` with the reason. Max 3 CVs per candidate (`409 RESUME_LIMIT_REACHED`). The first CV becomes the default. |
| `PATCH` | `/candidate/cvs/{id}` | candidate | Body `{ fileName }` (max 150). |
| `POST` | `/candidate/cvs/{id}/default` | candidate | Makes this CV the default. |
| `DELETE` | `/candidate/cvs/{id}` | candidate | Deleting the default promotes the newest remaining CV. The stored file is removed after commit. |
| `GET` | `/candidate/cvs/{id}/download` | candidate | Streams the PDF through the backend after the ownership check; no storage URL reaches the browser. Another candidate's CV is `404`. |

## Candidate Applications

An application is one row per candidate and job (`UNIQUE job_id, candidate_id`); withdrawing and re-applying reuse the same row. Statuses: `DRAFT`, `APPLIED`, `VIEWED`, `IN_REVIEW`, `INTERVIEW`, `OFFER`, `HIRED`, `REJECTED`, `WITHDRAWN`, `JOB_CLOSED`. All transitions live in `ApplicationStatusPolicy`; the candidate can only withdraw (any non-terminal status) or re-apply (`WITHDRAWN` to `APPLIED`). Recruiter-side transitions and `JOB_CLOSED` are applied by the recruiter application management task.

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/candidate/applications?status=&jobId=&page=&size=` | candidate | Own applications, most recently updated first. `ApplicationSummaryResource { id, status, jobId, jobTitle, companyId, companyName, submittedAt?, updatedAt }`. |
| `GET` | `/candidate/applications/form?jobId=` | candidate | `ApplyFormResource { jobId, jobTitle, companyName, open, questions: [{ id, type, prompt, required, options? }], application? }`. `application` is the candidate's own draft or submission. `404` for a draft job. |
| `GET` | `/candidate/applications/{id}` | candidate | `ApplicationResource { id, status, jobId, jobTitle, companyId, companyName, resumeId?, cv?: { fileName, fileSizeBytes }, coverLetter?, answers: [{ questionId, prompt, answer }], history: [{ from?, to, actorType, at }], submittedAt?, viewedAt?, updatedAt }`. Someone else's application is `404`. |
| `PUT` | `/candidate/applications/draft` | candidate | Auto-save. Body `SaveApplicationRequest { jobId, resumeId?, coverLetter? (max 5000), answers?: [{ questionId, answer (max 1000) }] }`. Partial answers are allowed; answers to questions the job no longer has are dropped. `409 ALREADY_APPLIED` once submitted. |
| `POST` | `/candidate/applications` | candidate | Submit, same body, `resumeId` required. Every required question must be answered and a `CHOICE` answer must be one of the options (`400 VALIDATION_FAILED`, fields `answers[i]`). The chosen CV is copied at this moment, so later edits or deletion of the CV do not change the application. Notifies the job's recruiter. `409 ALREADY_APPLIED`, `422 JOB_NOT_OPEN`, `422 CANNOT_APPLY_TO_OWN_COMPANY`, `422 IDENTITY_NOT_VERIFIED`. |
| `POST` | `/candidate/applications/{id}/withdraw` | candidate | `422 INVALID_STATUS_TRANSITION` from a terminal status. |
| `POST` | `/candidate/applications/{id}/reapply` | candidate | Body `{ resumeId }`. Only from `WITHDRAWN`; the first answers and cover letter are kept, only the CV changes. |
| `GET` | `/candidate/applications/{id}/cv` | candidate | Streams the application's own CV copy. |

- A job belongs to the candidate's own company when a recruiter account with the same email is an active member of it; that is refused with `CANNOT_APPLY_TO_OWN_COMPANY`.
- `applications.require-identity-verification` (env `APPLICATIONS_REQUIRE_IDENTITY_VERIFICATION`, default `false`) turns on the eKYC gate. Until the eKYC module supplies a real lookup, turning it on blocks every candidate.
- Screening questions cannot change once the job has a submitted (non-draft) application (`SCREENING_QUESTIONS_LOCKED`).

## Recruiter Applications

A recruiter sees every non-draft application of the jobs of the company they are linked to (`NOT_COMPANY_MEMBER` without one). Another company's application is `404`.

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/recruiter/applications?jobId=&status=&q=&page=&size=` | recruiter | Newest submission first. `RecruiterApplicationSummaryResource { id, status, jobId, jobTitle, candidateName, candidateEmail, viewed, submittedAt, updatedAt }`. `q` matches candidate name, email or job title. |
| `GET` | `/recruiter/applications/summary?jobId=` | recruiter | `{ total, byStatus }` for the company, optionally one job. |
| `GET` | `/recruiter/applications/{id}` | recruiter | Opening an `APPLIED` application moves it to `VIEWED` and stamps `viewedAt`. `RecruiterApplicationResource` adds `cv?`, `coverLetter?`, `answers`, `history: [{ from?, to, actorType, note?, at }]`, `notes: [{ id, authorId, authorName, content, createdAt }]` and `nextStatuses`, the statuses this recruiter can move it to right now. |
| `POST` | `/recruiter/applications/{id}/status` | recruiter | Body `{ status, note? (max 500) }`. Targets: `IN_REVIEW`, `INTERVIEW`, `OFFER`, `HIRED`, `REJECTED`; the move must be allowed by `ApplicationStatusPolicy` or `422 INVALID_STATUS_TRANSITION`. The note is stored on the history entry and is not shown to the candidate, who is notified (`APPLICATION_STATUS_CHANGED`). |
| `POST` | `/recruiter/applications/{id}/notes` | recruiter | Body `{ content }` (max 2000). Internal, never shown to the candidate. Returns the full resource. |
| `DELETE` | `/recruiter/applications/{id}/notes/{noteId}` | recruiter | Only the author can delete a note. |
| `GET` | `/recruiter/applications/{id}/cv` | recruiter | Streams the application's own CV copy. |

- Closing a job, or letting it expire, moves its unfinished applications (`APPLIED` to `OFFER`) to `JOB_CLOSED` (actor `SYSTEM`). A job hidden by an admin keeps its applications as they are.
- Applications store the candidate's name and email at the time of the first draft, so a recruiter can search by name without reading the candidate's account.

## Interviews

Status: `PROPOSED` (invited), `CONFIRMED`, `DECLINED`, `RESCHEDULE_REQUESTED` (candidate suggested another time), `CANCELLED`. `PROPOSED`, `CONFIRMED` and `RESCHEDULE_REQUESTED` are active; an application has at most one active interview (`409 INTERVIEW_ALREADY_SCHEDULED`). Times are ISO-8601 UTC; the UI shows them in GMT+7. Transitions are enforced by `InterviewStatusPolicy` (`422 INVALID_STATUS_TRANSITION`).

Resource: `{ id, applicationId, jobId, jobTitle, companyName, candidateName, startsAt, durationMinutes, format (ONLINE|OFFLINE), location, note, status, proposedStartsAt, candidateMessage, cancelReason, createdAt }`.

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/recruiter/interviews` | recruiter | Paged, soonest first. Query `status`. |
| `GET` | `/recruiter/interviews/by-application/{applicationId}` | recruiter | All interviews of one application, newest first. |
| `POST` | `/recruiter/interviews/by-application/{applicationId}` | recruiter | Body `{ startsAt (future), durationMinutes (15-480), format, location (link or address, max 500), note? (max 1000) }`. Moves the application to `INTERVIEW` (through `IN_REVIEW` when needed) and invites the candidate by notification and email. |
| `PUT` | `/recruiter/interviews/{id}` | recruiter | Same body. Resets to `PROPOSED`, clears the candidate's suggestion and reminders, and notifies the candidate. |
| `POST` | `/recruiter/interviews/{id}/accept-proposal` | recruiter | Only from `RESCHEDULE_REQUESTED`; takes the candidate's time and sets `CONFIRMED`. |
| `POST` | `/recruiter/interviews/{id}/cancel` | recruiter | Body `{ reason? (max 500) }`. |
| `GET` | `/candidate/interviews` | candidate | Paged, newest start first. |
| `POST` | `/candidate/interviews/{id}/confirm` | candidate | Only from `PROPOSED`, before the start time. |
| `POST` | `/candidate/interviews/{id}/decline` | candidate | Body `{ reason? (max 500) }`. From `PROPOSED`, `CONFIRMED` or `RESCHEDULE_REQUESTED`. |
| `POST` | `/candidate/interviews/{id}/reschedule-request` | candidate | Body `{ proposedStartsAt (future), message? (max 500) }`. From `PROPOSED` or `CONFIRMED`. |
| `GET` | `/candidate/interviews/{id}/calendar` | candidate | `text/calendar` `.ics` file; not available once `DECLINED` or `CANCELLED`. |

- Every event notifies the other side in-app and by email (`INTERVIEW_INVITED`, `_UPDATED`, `_CANCELLED` to the candidate; `_CONFIRMED`, `_DECLINED`, `_RESCHEDULE_REQUESTED` to the recruiter who scheduled it).
- Confirmed interviews send `INTERVIEW_REMINDER` to both sides 24 hours and 1 hour before the start, each once (checked every 5 minutes).

## Saved jobs and followed companies

All endpoints are `candidate` only. Saving and following are idempotent (`PUT` twice is fine, `DELETE` of something not saved is fine). Each list is capped at 200 items (`409 SAVED_LIMIT_REACHED`).

| Method | Path | Notes |
|---|---|---|
| `GET` | `/candidate/saved-jobs` | Paged, newest first. Item `{ jobId, savedAt, job? }`; `job` is the public job summary and is absent when the job is closed, expired, hidden or deleted. |
| `GET` | `/candidate/saved-jobs/ids` | All saved job ids, used to show the heart state on lists. |
| `PUT` | `/candidate/saved-jobs/{jobId}` | Only a currently public job (`404 NOT_FOUND` otherwise). |
| `DELETE` | `/candidate/saved-jobs/{jobId}` | |
| `GET` | `/candidate/followed-companies` | Paged, newest first. Item `{ companyId, followedAt, company }` with the public company resource. |
| `GET` | `/candidate/followed-companies/ids` | All followed company ids. |
| `PUT` | `/candidate/followed-companies/{companyId}` | `404 NOT_FOUND` for an unknown company. |
| `DELETE` | `/candidate/followed-companies/{companyId}` | |

- Publishing a job (`DRAFT` to `PUBLISHED`, not a resume from `PAUSED`) notifies every follower of the company with `FOLLOWED_COMPANY_NEW_JOB` (category `JOBS`, not mandatory, so followers can switch it off in notification preferences).

## Error codes

| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_FAILED` | 400 | See `error.details[{ field, message }]` |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password; `error.meta.captchaRequired` is true after 3 failures |
| `INVALID_OR_EXPIRED_TOKEN` | 400 | Verification or reset link is invalid, expired or already used |
| `EMAIL_ALREADY_VERIFIED` | 409 | |
| `EMAIL_NOT_VERIFIED` | 422 | The action requires a verified email (e.g. publishing a job) |
| `UNAUTHENTICATED` | 401 | Missing/expired token → frontend tries refresh once |
| `FORBIDDEN` | 403 | Role/ownership failure |
| `NOT_FOUND` | 404 | |
| `METHOD_NOT_ALLOWED` | 405 | The HTTP method is not supported by this endpoint |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | The request `Content-Type` is not supported by this endpoint |
| `INTERVIEW_ALREADY_SCHEDULED` | 409 | The application already has an active interview |
| `SAVED_LIMIT_REACHED` | 409 | The candidate already saved or follows the maximum number of items |
| `INTERNAL_ERROR` | 500 | Unexpected server error; the cause is logged server-side and never returned |
| `EMAIL_ALREADY_USED` | 409 | |
| `ACCOUNT_BANNED` | 403 | The account is banned, so signing in and refreshing are both refused. Only raised after the password matches, so it never reveals the state of an account to someone who does not hold its credentials |
| `ROLE_ALREADY_GRANTED` | 409 | The user already holds an active grant for this role |
| `ROLE_NOT_ASSIGNED` | 422 | The user does not hold this role |
| `CANNOT_REMOVE_SELF_ADMIN` | 422 | An admin cannot remove their own admin role |
| `CANNOT_REMOVE_LAST_ROLE` | 422 | A user must retain at least one role |
| `ACCOUNT_DELETED` | 403 | The account has been permanently deleted |
| `ACCOUNT_NOT_PENDING_DELETION` | 422 | The account is not pending deletion |
| `DELETION_BLOCKED` | 422 | Account deletion is blocked while unresolved operations remain |
| `JOB_NOT_EDITABLE` | 422 | The job is closed, expired, hidden, or not a draft (for delete) |
| `ALREADY_APPLIED` | 409 | The candidate already has a submitted application for this job |
| `JOB_NOT_OPEN` | 422 | The job is not published or its deadline has passed |
| `CANNOT_APPLY_TO_OWN_COMPANY` | 422 | An active member of the job's company cannot apply to it |
| `IDENTITY_NOT_VERIFIED` | 422 | The eKYC gate is on and the candidate is not verified |
| `RESUME_LIMIT_REACHED` | 409 | The candidate already has the maximum number of CVs |
| `SCREENING_QUESTIONS_LOCKED` | 422 | The job already has applications, so its screening questions cannot change |
| `SKILL_NAME_ALREADY_USED` | 409 | A skill with this name already exists |
| `PROFILE_SECTION_LIMIT_REACHED` | 409 | A candidate profile section already holds its maximum number of items |
| `OAUTH_STATE_INVALID` | 400 | The social sign-in `state` is unknown, expired, already used, or issued for another provider |
| `OAUTH_NOT_CONFIGURED` | 503 | The provider client id or secret is not configured |
| `OAUTH_PROVIDER_ERROR` | 502 | The provider rejected the code or could not be reached |
| `OAUTH_EMAIL_UNVERIFIED` | 422 | The provider account has no email, or the email is not verified; nothing is created |
| `OAUTH_LINK_REQUIRES_VERIFIED_EMAIL` | 409 | An account with this email exists but its email is not verified; sign in with the password and verify the email first |
| `OAUTH_ACCOUNT_NOT_FOUND` | 404 | No account for this provider identity and the terms were not accepted; send the user to `/register` |
| `SOCIAL_LOGIN_NOT_ALLOWED` | 403 | The matching account holds the `ADMIN` role; admins sign in only through `/admin/login` |
| `PASSWORD_NOT_SET` | 422 | The action needs a password and the account has none (change email, disable 2FA, grant `ADMIN`); set one first with `POST /users/me/change-password` |
| `RATE_LIMITED` | 429 | Honor `Retry-After` |
| `AI_USER_QUOTA_EXCEEDED` | 429 | Daily AI limit per user reached; honor `Retry-After` |
| `AI_IP_QUOTA_EXCEEDED` | 429 | Hourly AI limit per IP reached; honor `Retry-After` |
| `AI_NOT_CONFIGURED` | 503 | AI provider key missing or rejected |
| `AI_PROVIDER_BUSY` | 503 | AI provider is rate limited or overloaded; retry later |
| `AI_PROVIDER_TIMEOUT` | 504 | AI provider did not answer in time |
| `AI_PROVIDER_ERROR` | 502 | AI provider returned an error or an unreadable response |
| `AI_REQUEST_REFUSED` | 422 | AI provider declined to process the content |
| `AI_PROMPT_NOT_FOUND` | 500 | Server prompt file is missing |
| `COMPANY_LINK_UNDER_REVIEW` | 409 | Leaving the company is blocked while the user's documents await review |
| `TAX_CODE_NOT_FOUND` | 422 | The tax code was not found in the national business registry |
| `TAX_LOOKUP_BUSY` | 429 | The registry lookup is rate limited; honor `Retry-After` |
| `TAX_LOOKUP_UNAVAILABLE` | 503 | The registry lookup is not reachable right now |

## Recruiter Account

Recruiters are a separate account type stored in `recruiters`; the same email may also exist as a candidate. The access token carries the claim `typ=RECRUITER`; the refresh token is the `recruiter_refresh_token` cookie.

| Status | Endpoint | Auth | Body | Notes |
|---|---|---|---|---|
| ✅ | `POST /recruiter/auth/register` | public | `RecruiterRegisterRequest` (`name`, `email`, `password`, `confirmPassword`, `acceptTerms`; optional declared profile `gender` `MALE` `FEMALE` `OTHER`, `companyName` max 255, `province` max 100, `districtWard` max 255; trimmed, blank stored as null) | `RecruiterAuthResource { accessToken, recruiter }` + refresh cookie. `EMAIL_ALREADY_USED` only checks `recruiters`. |
| ✅ | `POST /recruiter/auth/login` | public | `LoginRequest` | Same response; `INVALID_CREDENTIALS`, `ACCOUNT_BANNED`, `ACCOUNT_DELETED`. |
| ✅ | `POST /recruiter/auth/refresh` | cookie | – | Rotates the refresh token. |
| ✅ | `POST /recruiter/auth/logout` | recruiter | – | Blacklists the access token, revokes the refresh token. |
| ✅ | `GET /recruiter/me` | recruiter | – | `RecruiterResource { id, email, name, phone, gender?, companyName?, province?, districtWard?, status, emailVerified, phoneVerified, hasPassword, deleteRequestedAt?, createdAt }` (`hasPassword` is `false` for a recruiter created with Google that never set a password). `gender`, `companyName`, `province`, `districtWard` are declared by the recruiter at sign-up, are not verified and are for pre-fill only; company profile and company phone pages may pre-fill from these fields. |
| ✅ | `PUT /recruiter/me/profile` | recruiter | `RecruiterProfileRequest` (`name` required max 50, optional `gender` `MALE` `FEMALE` `OTHER`, `companyName` max 255, `province` max 100, `districtWard` max 255; trimmed, blank stored as null) | Returns `RecruiterResource` ("Profile updated successfully!"). Replaces the declared profile fields and the name; does not touch phone or any verification. Field errors on `name`, `companyName`, `province`, `districtWard`. Used by the Google sign-up onboarding step. |
| ✅ | `POST /recruiter/me/phone/send-otp` | recruiter | `SendPhoneOtpRequest` (`phone`) | Sends a 6-digit code by SMS. `PHONE_ALREADY_VERIFIED`, `PHONE_ALREADY_USED`; `RATE_LIMITED` (429, `Retry-After`) per recruiter and per IP. |
| ✅ | `POST /recruiter/me/phone/verify` | recruiter | `VerifyPhoneOtpRequest` (`code`) | Returns `RecruiterResource` with `phoneVerified: true`. `PHONE_OTP_NOT_REQUESTED`, `PHONE_OTP_INVALID`, `PHONE_ALREADY_USED`. |
| ✅ | `POST /recruiter/me/delete-request` | recruiter | – | Sets `status` `PENDING_DELETION`, revokes every refresh token and the session; data null. Idempotent while pending; `ACCOUNT_DELETED` if already deleted; `ACCOUNT_BANNED` if suspended. Signing in again within 7 days cancels the deletion and restores `ACTIVE`; after 7 days the account is anonymized and sign-in returns `ACCOUNT_DELETED`. Not yet blocked by company ownership. |
| ✅ | `POST /recruiter/me/cancel-deletion` | recruiter | – | Returns `RecruiterResource` with `status` `ACTIVE`. `ACCOUNT_NOT_PENDING_DELETION`. |
| ✅ | `POST /recruiter/me/email/change-request` | recruiter | `ChangeEmailRequest` (`newEmail`, `currentPassword`) | `PASSWORD_NOT_SET` 422 when the recruiter has no password. Mails a confirmation link to the new email and a notice to the old one. Field errors on `currentPassword` / `newEmail` (same as current email). `EMAIL_ALREADY_USED` for an email already in `recruiters` (an email that exists only as a candidate is allowed). `RATE_LIMITED` (429, `Retry-After`): 3 attempts per 15 min per account, and mails limited like resend-verification (60s cooldown, 3 per 15 min by email and IP) only when a mail is actually sent. The confirmation link is bound to the requested new email. |
| ✅ | `POST /recruiter/auth/confirm-email-change` | public | `VerifyEmailRequest` (`token`) | Sets the new email, marks it verified and signs out every device. `INVALID_OR_EXPIRED_TOKEN`, `EMAIL_ALREADY_USED`. The mailed link is `{frontendUrl}/recruiter/confirm-email-change?token=…` (valid 24h, single use). |
| ✅ | `POST /recruiter/me/change-password` | recruiter | `ChangePasswordRequest` (`currentPassword`, `password`, `confirmPassword`; `currentPassword` is ignored and optional when `hasPassword=false`, which sets the first password, and required otherwise) | Signs out every other device. Field errors on `currentPassword` / `password` / `confirmPassword`. `RATE_LIMITED` (429, `Retry-After`) after 3 attempts per 15 min. |
| ✅ | `GET /recruiter/me/sessions` | recruiter | – | `AccountSessionResource[] { id, deviceLabel, ipAddress, location?, createdAt, lastUsedAt, current }`; `location` is always null; `current` marks the device making the request. |
| ✅ | `DELETE /recruiter/me/sessions/{sessionId}` | recruiter | – | Signs out one device. The current session cannot be revoked here; use logout (`VALIDATION_FAILED` on `sessionId`). `NOT_FOUND` for another recruiter's session. |
| ✅ | `POST /recruiter/me/sessions/revoke-others` | recruiter | – | Signs out every other device (its access token keeps working until it expires, up to 15 min). |
| ✅ | `POST /recruiter/auth/verify-email` | public | `VerifyEmailRequest` (`token`) | Marks the recruiter email verified. `INVALID_OR_EXPIRED_TOKEN`. The mailed link is `{frontendUrl}/recruiter/verify-email?token=…` (valid 24h, single use). |
| ✅ | `POST /recruiter/auth/oauth/{provider}/authorize` | public | `OAuthAuthorizeRequest` `{ intent: "LOGIN" \| "REGISTER", acceptTerms? }` (`provider`: `google`) | `{ authorizationUrl }` and sets the HttpOnly `recruiter_oauth_state_nonce` cookie (path `/api/v1/recruiter/auth/oauth`, 5 min). Same rules and errors as `POST /auth/oauth/{provider}/authorize`; the Redis state is separate from the candidate one, so a candidate state is rejected here and vice versa. The Google redirect URI is `{frontendUrl}/recruiter/auth/callback/google`. `RATE_LIMITED` 429 (20 per 10 min per IP). |
| ✅ | `POST /recruiter/auth/oauth/{provider}` | public | `OAuthCallbackRequest` `{ code, state }`; requires the `recruiter_oauth_state_nonce` cookie | Same as `POST /recruiter/auth/login` (`{ accessToken, recruiter, requiresTwoFactor, tempToken, newAccount }` + recruiter refresh cookie; the `recruiter_device_trust` cookie bypasses 2FA exactly as on login, otherwise the challenge is returned) ("Logged in successfully!"); once the body is valid, the nonce cookie is always cleared. `newAccount` is `true` only when this call created the recruiter (email already verified, no password, no verification mail), `false` otherwise. A new recruiter is created only when the state carries `acceptTerms=true`, else `OAUTH_ACCOUNT_NOT_FOUND`. An existing recruiter with the same email is linked only when its email is verified, else `OAUTH_LINK_REQUIRES_VERIFIED_EMAIL`. Errors: `OAUTH_STATE_INVALID` 400, `OAUTH_PROVIDER_ERROR` 502, `OAUTH_NOT_CONFIGURED` 503, `OAUTH_EMAIL_UNVERIFIED` 422, `OAUTH_LINK_REQUIRES_VERIFIED_EMAIL` 409, `OAUTH_ACCOUNT_NOT_FOUND` 404, plus `ACCOUNT_BANNED` / `ACCOUNT_DELETED`. The same Google account may also be linked to a candidate. Linking an existing recruiter notifies it by a security notice (no audit entry). |
| ✅ | `POST /recruiter/auth/resend-verification` | recruiter | – | Mails a new verification link. `EMAIL_ALREADY_VERIFIED`; `RATE_LIMITED` (429, `Retry-After`; 60s cooldown, 3 per 15 min by email and IP). |
| ✅ | `POST /recruiter/auth/forgot-password` | public | `ForgotPasswordRequest` (`email`) | Always returns the same generic message; mails `{frontendUrl}/recruiter/reset-password?token=…` only when the recruiter exists. `RATE_LIMITED` (429, `Retry-After`; 60s cooldown, 3 per 15 min by email and IP). |
| ✅ | `POST /recruiter/auth/reset-password` | public | `ResetPasswordRequest` (`token`, `password`, `confirmPassword`) | Revokes every recruiter refresh token and the recruiter session. `INVALID_OR_EXPIRED_TOKEN` (link valid 15 min, single use). |

Password-less recruiters (`recruiters.password IS NULL`, only those created with Google; every such recruiter has a `recruiter_social_accounts` row): `POST /recruiter/auth/login` answers `INVALID_CREDENTIALS` like a wrong password; change email and disabling 2FA answer `PASSWORD_NOT_SET` 422; 2FA reconfigure and recovery-code regeneration fail the password check; forgot/reset password and `POST /recruiter/me/change-password` set a password. The purge job also removes the social links.

Not built yet: admin management of recruiters. Company endpoints still key members by the principal id; point `company_members` and the other recruiter-owned columns at `recruiters.id`.

## Recruiter Company Link

- A company record holds identity only: `name`, `taxCode`, `registeredAddress`, all taken from the national business registry. It is created only when the tax code is found there.
- `POST /recruiter/company` body `{ taxCode }`: 10 digits, optionally followed by a 3-digit branch code (`0101234567-001`). The registry is queried with the first 10 digits. An existing company with the same tax code is linked instead of duplicated. Errors: `TAX_CODE_NOT_FOUND`, `TAX_LOOKUP_BUSY`, `TAX_LOOKUP_UNAVAILABLE`.
- `GET /recruiter/company/lookup-tax?taxCode=` looks the tax code up in the registry and returns `TaxLookupResource { taxCode, name, address, existingOnPlatform, existingCompanyId? }`. Same errors as the create call.
- `GET /companies/{id}` (public) returns `PublicCompanyResource { id, name, tradingName?, address?, industry?, size?, website?, email?, phone?, description?, benefits?, logoUrl?, photoUrls }`. The profile shown is the most recently updated one, among active members, that has a description; a company with no profile only shows its registry `name` and `address`. Open jobs of a company come from `GET /jobs?companyId=`.
- `POST /recruiter/company/join` links an existing company by `companyId`. `POST /recruiter/company/leave` unlinks; rejoining the same company is allowed, a revoked membership is not.
- There are no company roles: every linked recruiter is equal and manages only their own profile.
- `PUT /recruiter/company` saves the caller's own company profile (trading name, industry, size, address, description...). Logo and photos are also per recruiter. Name and tax code cannot be edited.
- Verification is per person. The company itself is never "verified"; a verified company never makes a new member verified.
- `GET /recruiter/company/verification` returns `linkState`:
  - `NONE`: no company linked.
  - `CHOSEN`: linked, no proof under review.
  - `SUBMITTED`: an own document awaits review.
  - `REJECTED`: the latest own document was rejected (reason in the `LICENSE` step).
  - `VERIFIED`: the user holds their own approved, unexpired document.
- Switching company is allowed in `CHOSEN`, `REJECTED` and `VERIFIED`; `leave` is blocked in `SUBMITTED` with `COMPANY_LINK_UNDER_REVIEW`.
- Publishing a job requires `VERIFIED` plus verified email, phone and accepted personal agreements. Otherwise `blockedReason` and the gate return `EMAIL_NOT_VERIFIED`, `NOT_COMPANY_MEMBER`, `VERIFICATION_INCOMPLETE` or `RECRUITER_NOT_AUTHORIZED_FOR_COMPANY`.
- `GET /recruiter/company/documents` lists only the caller's own documents.
- Admin: `GET /admin/companies/{id}/members` and `DELETE /admin/companies/{id}/members/{userId}` remain; `transfer-owner` was removed with the roles.
- Frontend: `CompanyResource` no longer carries `verified`, `verificationStatus`, `myRole` or `legalFieldsLocked`, and `CompanySummaryResource` is reduced to `id, name, taxCode, address`.
