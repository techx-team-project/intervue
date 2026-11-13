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
| ✅ | `POST /ai/chat` | public / optional user | `{ message, sessionId? }` | `{ answer, sources }` |
| ✅ | `POST /ai/resume-match` | recruiter | `{ applicationId?, jobTitle, jobRequirements, jobDescription?, candidateData?, cvText? }` | `ResumeMatchResult` `{ applicationId, experienceSummary, requirements, questionsToAsk, model, promptVersion, aiProcessedCandidateData, analyzedAt, disclaimer }` (Runs async; sensitive PII/KYC and screening questions strictly stripped) |
| ✅ | `POST /ai/cv-reviews` | candidate | `{ resumeId?, cvText?, targetPosition?, jobId?, level? }` | `CvReviewResult` `{ id, fileHash, overallScore, summary, comments, reviewLevel, jobId, jobTitle, companyName, jobFitScore, requirementMatches, keyStrengths, gapAnalysis, tailoringTips, chargedCredits, refunded, fromCache }` (Level 1/2 free with 3 uses/day; Level 3 paid 1 credit/use with per-requirement comparison and automatic refund on AI failure; unchanged CV returns cached result without charging/quota) |
| ✅ | `POST /ai/cover-letter` | candidate | `{ jobTitle, companyName, jobRequirements?, jobDescription?, resumeId?, cvText?, candidateName? }` | `CoverLetterGenerateResult` `{ coverLetter, modelVersion, promptVersion, notice }` (Fact-only draft from CV and job; user edits before sending; never sent automatically) |
| ✅ | `POST /ai/cv-reviews/upload` | candidate | multipart `file`, `targetPosition?`, `jobId?` | `CvReviewResult` (PDF upload; unreadable detected with clear reason; cached by hash; supports level 3 with jobId) |
| ✅ | `GET /ai/cv-reviews/quota` | candidate | – | `CvReviewQuotaResource` `{ usedToday, remaining, maxDaily, resetAt }` |
| ✅ | `GET /ai/cv-reviews/{id}` | candidate | – | `CvReviewResult` (strictly accessible only by candidate owner) |
| ✅ | `GET /ai/cv-reviews` | candidate | – | `List<CvReviewResult>` (review history for authenticated candidate) |
| ✅ | `GET /candidate/credits` | candidate | – | `CandidateCreditSummaryResource` `{ candidateId, currentBalance, totalCharged, totalRefunded, recentTransactions }` |
| ✅ | `POST /candidate/credits/topup` | candidate | `{ amount }` | `CandidateCreditSummaryResource` (tops up credits with audit ledger transaction) |
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
| ✅ | `POST /candidate/profile/parse-cv` | candidate | multipart `file` (PDF) or `?resumeId=` | `CvParseProfileResponse { readable: boolean, unreadableReason?: string, reasonMessage?: string, profileEmpty: boolean, parsedData: ParsedProfileData, diffs: ProfileDiffItem[] }`. If CV is unreadable (password protected, scanned, empty, etc.), `readable` is false with the exact reason. If profile is empty, `profileEmpty` is true for confirmation. If profile already exists, provides old -> new diff per field for selective update. |
| ✅ | `POST /candidate/profile/apply-cv-parsed` | candidate | `ApplyCvParsedRequest { applyHeadline, applyDesiredRole, applyBio, applyTotalYoe, applySkills, applyExperiences, applyEducations, applyCertifications, applyLanguages, parsedData }` | `CandidateProfileResource` with selected fields updated. |
| ✅ | `POST /candidate/mock-interviews` | candidate | multipart: `targetRole`, `seniorityLevel`, `focusArea`, `questionCount`, optional PDF `file` | `MockInterviewDetailResource` (Starts interactive AI mock interview with 5-10 questions. The optional CV is used only for this session and is never linked to the profile or kept with the interview; its extracted text is cached by file hash for 30 days by the shared CV text extractor. Unreadable text answers `422 CV_TEXT_NOT_READABLE`. Never accesses recruiter screening questions) |
| ✅ | `GET /candidate/mock-interviews` | candidate | – | `List<MockInterviewSummaryResource>` (History of mock interview sessions) |
| ✅ | `GET /candidate/mock-interviews/{id}` | candidate | – | `MockInterviewDetailResource` (Full interview details, questions, answers, feedback, strengths, improvements) |
| ✅ | `POST /candidate/mock-interviews/{id}/questions/{questionId}/answer` | candidate | `SubmitMockAnswerRequest { answer }` | `SubmitAnswerResultResource` (Evaluates answer, scores 0-100, at most one follow-up per question, provides ideal answer summary) |
| ✅ | `POST /candidate/mock-interviews/{id}/questions/{questionId}/follow-up` | candidate | `SubmitMockFollowUpRequest { followUpAnswer }` | `SubmitAnswerResultResource` (Answers follow-up; advances question; triggers session summary with exactly 3 strengths and 3 improvements upon completion) |

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
| `GET` | `/recruiter/jobs/summary` | recruiter | `{ total, byStatus: { DRAFT, PENDING_REVIEW, PUBLISHED, PAUSED, CLOSED, EXPIRED, HIDDEN_BY_ADMIN } }`. |
| `GET` | `/recruiter/jobs/{id}` | recruiter | `JobResource` (includes `hiddenReason` and `hiddenAt` while the job is hidden by an admin). `404 NOT_FOUND` for someone else's job. |
| `POST` | `/recruiter/jobs` | recruiter | Creates a `DRAFT`. Only `title` is required (5-150 characters); everything else may be partial. `403 NOT_COMPANY_MEMBER` without a company. The company name is snapshotted on the job. |
| `PUT` | `/recruiter/jobs/{id}` | recruiter | Salary `min`/`max` must be positive, `min <= max`, and between 1,000,000 and 250,000,000 VND, or 50 and 10,000 USD. `openings` is 1-100. `deadline` cannot be in the past or more than 90 days ahead (also enforced by `renew`). Location also accepts optional `latitude`/`longitude` (sent together, -90..90 / -180..180). Allowed in `DRAFT`, `PUBLISHED`, `PAUSED` (otherwise `422 JOB_NOT_EDITABLE`). A non-draft job must stay complete and its `deadline` cannot exceed the purchased package window (`422 JOB_DEADLINE_EXCEEDS_PACKAGE` / `422 ENTITLEMENT_EXPIRED`). Changing the title, salary, location, contract type or working arrangement of a non-draft job notifies applicants whose applications are still open (`JOB_TERMS_CHANGED_FOR_APPLICANT`). |
| `POST` | `/recruiter/jobs/{id}/publish` | recruiter | `DRAFT` to `PUBLISHED`. Runs the publish gate (`assertCanPublish`) and completeness/deadline checks (`422 JOB_DEADLINE_EXCEEDS_PACKAGE`); incomplete jobs return `400 VALIDATION_FAILED` with the missing `fieldErrors`. While the company has fewer than `jobReviewFirstCount` (default 3) approved jobs the job goes to `PENDING_REVIEW` instead of `PUBLISHED` and no slot is spent yet; the response `status` tells which. A `PENDING_REVIEW` job cannot be edited. |
| `POST` | `/candidate/jobs/{id}/report` | candidate | Body `{ reasonCode: SCAM\|HARASSMENT\|SPAM\|INAPPROPRIATE\|OTHER, note? (max 500) }`. Files a `JOB_POST` report for the admin queue. `404 NOT_FOUND` unless the job is `PUBLISHED` and not past its deadline; `409 REPORT_ALREADY_FILED` if the candidate already has a `PENDING` report for it. Returns `201`. When a job reaches 3 pending reports from different candidates every admin is notified once (`JOB_REPORT_THRESHOLD_REACHED`); the job is never hidden automatically. |
| `POST` | `/recruiter/jobs/{id}/pause` · `/resume` · `/close` | recruiter | `PUBLISHED` to `PAUSED`, `PAUSED` to `PUBLISHED` (gate & deadline re-checked), `PUBLISHED`/`PAUSED` to `CLOSED`. Anything else is `422 INVALID_STATUS_TRANSITION`. Paused time is not charged: `resume` pushes the `deadline` and the paid slot end back by the whole days/time spent paused, and paused jobs are not auto-expired. A company with no paid slot can keep `jobFreeActiveLimit` jobs `PUBLISHED` at once (`422 ENTITLEMENT_EXHAUSTED` beyond that, also on `resume`). |
| `POST` | `/recruiter/jobs/{id}/extend` | recruiter | Body `{ deadline }` (same rules as `renew`). Moves the `deadline` of a `PUBLISHED` or `PAUSED` job later without spending a slot; the new date must be after the current one and stay inside the paid slot or the free window (`400` on `deadline` otherwise). Audited as `JOB_UPDATED`. A daily job at 08:00 (Asia/Ho_Chi_Minh) notifies recruiters of jobs whose deadline is 3 days away (`JOB_EXPIRING_SOON`, link `/recruiter/jobs?extend={id}`). |
| `POST` | `/recruiter/jobs/{id}/renew` | recruiter | Body `{ deadline }` (required, today or later). A job the recruiter closed less than 7 days ago whose paid slot has not ended reopens without spending another slot. Puts a `CLOSED` or `EXPIRED` job of the caller back to `PUBLISHED` with the new `deadline`, keeping its applications and URL. Runs the same publish gate as `publish` (company verification, completeness, content screening) and spends one job slot (`422 ENTITLEMENT_EXHAUSTED` when the policy requires a slot and none is left; `400` on `deadline` when it runs past the purchased package). Resets `publishedAt` to now. Any other status is `422 INVALID_STATUS_TRANSITION`; someone else's job is `404`. |
| `GET` | `/recruiter/jobs/{id}/history?page=&size=` | recruiter | `PageResource<{ action, actorType, detail?, reason?, createdAt }>`, newest first, for the caller's own job (`404` otherwise). `action`: `JOB_CREATED` `JOB_UPDATED` (`detail` lists the changed fields, e.g. `title, salary`; drafts are not logged) `JOB_PUBLISHED` `JOB_PAUSED` `JOB_RESUMED` `JOB_CLOSED` `JOB_RENEWED` (`detail` = new deadline), plus the admin `JOB_HIDDEN` and `JOB_RESTORED`. `actorType` is `RECRUITER`, `ADMIN` or `SYSTEM`. |
| `GET` | `/recruiter/jobs/quota` | recruiter | `{ slotsRemaining, slotRequired }`: job slots the company still holds and whether the free-quota policy requires a slot to publish. |
| `GET` | `/recruiter/jobs/similar?title=&city=&excludeId=` | recruiter | `title` required (max 150), `city` (max 100), optional `excludeId`. Up to 5 `PUBLISHED` jobs of the caller's company with the same title and city (case-insensitive) as `[{ id, title, city }]`; empty when `city` is blank. Used to warn before publishing, never blocks. |
| `GET` | `/recruiter/jobs/{id}/stats?days=` | recruiter | `days` 1-90 (default 30, else `400` on `days`). `{ totalViews, totalApplications, conversionRate?, daily: [{ date, views, applications }] }` for the caller's own job (`404` otherwise), one entry per day in Vietnam time with zeros filled in. `conversionRate` is applications / views in percent and is omitted when there are no views. Applications are the job's non-draft applications grouped by submission day; views include the not-yet-flushed count of today. |
| `DELETE` | `/recruiter/jobs/{id}` | recruiter | Drafts only (`422 JOB_NOT_EDITABLE` otherwise). |
| `GET` | `/admin/jobs?q=&status=&companyId=&page=&size=&sort=` | admin | `PageResource<AdminJobSummaryResource { id, title, status, companyId, companyName, level?, city?, salary, deadline?, publishedAt?, hiddenReason?, updatedAt }>`. Drafts are never listed. `q` matches title or company name. |
| `GET` | `/admin/jobs/summary` | admin | `{ total, byStatus }` over every non-draft job. |
| `GET` | `/admin/jobs/insights?days=` | admin | `AdminJobInsightsResource { days, pendingReview, submitted, approved, rejected, approvalRate?, avgReviewHours?, publishedPerDay: [{ date, count }], mostReported: [{ jobId, title, companyName, pendingReports }] }`. `days` is `7`, `30` (default) or `90`, anything else is `400 VALIDATION_FAILED`. Review figures come from the `JOB_SUBMITTED`, `JOB_APPROVED` and `JOB_REJECTED` audit entries inside the window; `avgReviewHours` is submission to decision and `approvalRate` is approved over decided, both `null` when nothing was decided. `publishedPerDay` has one entry per day (Asia/Ho_Chi_Minh), zero-filled. `mostReported` lists the top 5 jobs by pending reports. |
| `GET` | `/admin/jobs/{id}` | admin | Full `JobResource`; `404` for a draft. |
| `POST` | `/admin/jobs/{id}/hide` | admin | Body `{ reason }` (required, max 500). `PUBLISHED` or `PAUSED` to `HIDDEN_BY_ADMIN`; anything else is `422 INVALID_STATUS_TRANSITION`. Stores `hiddenReason`, `hiddenAt`, writes an audit entry (`JOB_HIDDEN`) and notifies the recruiter (`JOB_HIDDEN_BY_ADMIN`, mandatory). A hidden job is not `PUBLISHED`, so it leaves public search and detail. |
| `POST` | `/admin/jobs/{id}/restore` | admin | `HIDDEN_BY_ADMIN` to `PUBLISHED`, or to `EXPIRED` when the deadline has passed. Clears the hidden fields, audits `JOB_RESTORED` and notifies the recruiter. |
| `POST` | `/admin/jobs/{id}/approve` | admin | `PENDING_REVIEW` to `PUBLISHED`: runs the publish gate, spends the job slot (or the free allowance), audits `JOB_APPROVED` and notifies the recruiter (`JOB_APPROVED`). Any other status is `422 INVALID_STATUS_TRANSITION`; `ENTITLEMENT_EXHAUSTED` if the company no longer has capacity. |
| `POST` | `/admin/jobs/{id}/reject` | admin | Body `{ reason }` (required, max 500). `PENDING_REVIEW` to `DRAFT`, audits `JOB_REJECTED` and notifies the recruiter (`JOB_REJECTED`) with the reason. |
| `GET` | `/jobs?q=&city=&contractType=&workingArrangement=&level=&jobRole=&experienceYears=&skillIds=&salaryFrom=&currency=&postedWithinDays=&sort=&page=&size=` | public | `PageResource<PublicJobSummaryResource>` of `PUBLISHED` jobs whose deadline is today or later. Default order (`sort` omitted, `RECOMMENDED` or `NEWEST`): `publishedAt` newest, then `id`. `sort=SALARY_DESC` orders by maximum salary (USD converted at a fixed 25,000 VND), negotiable jobs last; `sort=DEADLINE_ASC` orders by the nearest deadline. Spring `sort` page params are still ignored. `postedWithinDays` (1-90) keeps jobs whose `publishedAt` is within that many days. An unknown `sort` or an out-of-range `postedWithinDays` returns `400`. `q` matches title or company name; `companyId` limits to one company; `city` is an exact match; `jobRole` is an exact match on the job role; `experienceYears` (0-30) keeps jobs that need at most that many years (jobs with no minimum always match); `skillIds` matches any of up to 10; `salaryFrom` keeps non-negotiable jobs whose maximum is at least that amount in `currency` (default `VND`). Item: `{ id, title, company: { id, name, logoUrl? }, level, jobRole?, contractType, workingArrangement, city, salary, skills, deadline, publishedAt, highlightLabel, highlighted }`. `highlightLabel` is `HOT` and renders as a badge; `highlighted` tints the card. Both are gated by their `*_expires_at` timestamps at map time. |
| `GET` | `/jobs/nearby?lat=&lng=&radiusKm=` | public | `NearbyJobResource[] { job: PublicJobSummaryResource, address?, latitude, longitude, distanceKm }` for `PUBLISHED`, not-expired jobs that have coordinates within `radiusKm` (1-100, default 10) of the point, ordered by `publishedAt` desc, then distance/id. `400 VALIDATION_FAILED` for missing or out-of-range `lat` (-90..90) / `lng` (-180..180). |
| `GET` | `/jobs/recommendations?limit=` | public / candidate | `JobRecommendationResponse { items: [{ job: PublicJobSummaryResource, matchReason: string, matchScore: number, matchedSkills: string[] }], fallback: boolean, fallbackReason?: string, nudgeMessage?: string, nudgeActionUrl?: string }`. Matches candidate profile skills, desired role, preferred location, and level against active published jobs. Returns short reasons (e.g. `Matches 3/4 required skills: Java, Spring Boot`). If candidate profile is empty or caller is unauthenticated/guest, returns newest jobs with `fallback: true` and a nudge to complete profile. |
| `GET` | `/jobs/{id}` | public | `PublicJobResource` (summary fields plus `location`, `experience? { minYears?, maxYears? }`, `description`, `requirements`, `benefits`, `benefitTags`, `hiringSteps`, `openings`, `highlightLabel`, `highlighted`, and `company.address`). `404 NOT_FOUND` unless the job is `PUBLISHED` and not past its deadline. Also returns `screening: { questionCount, requiredCount, estimatedMinutes }` so candidates see the effort before applying; the questions themselves are not public. |
| `POST` | `/jobs/{id}/view` | public | Counts one view of a `PUBLISHED`, not-expired job (`404` otherwise). Called by the browser, not the server-rendered page, so crawlers and the two server fetches per render are not counted. At most one view per IP per job per 30 minutes; counters live in Redis (`job:views:{id}`) and are flushed into `job_daily_stats` every 5 minutes. Always `200`; a Redis failure is logged, never returned. |

- `SaveJobRequest`: `{ title, level, jobRole, experience?: { minYears, maxYears }, contractType, workingArrangement, location: { city, address }, salary: { negotiable, min, max, currency, basis }, skillIds, description, requirements, benefits, benefitTags?, hiringSteps?, deadline, openings, screeningQuestions? }`. Salary is monthly, in the minor unit of `currency` (`VND` or `USD`); `deadline` is a date in Vietnam time.
- `jobRole`: `BACKEND` `FRONTEND` `FULLSTACK` `MOBILE` `DEVOPS` `QA` `DATA_AI` `BA` `PM` `UIUX` `SECURITY` `OTHER`; required to publish. `salary.basis`: `GROSS` or `NET`; required to publish when the salary is a range (cleared when negotiable). `experience` years are 0-30 and `minYears` must not exceed `maxYears`. `benefitTags` (max 10, duplicates dropped): `HEALTH_INSURANCE` `BONUS_13TH_MONTH` `PERFORMANCE_BONUS` `LAPTOP` `TRAINING` `TEAM_BUILDING` `FLEXIBLE_HOURS` `REMOTE_DAYS` `ANNUAL_LEAVE` `MEALS`. `hiringSteps` is an ordered list of up to 6 steps, each 1-80 characters. Both are full replaces and optional.
- **Content screening (job scope filter words).** Saving a `DRAFT` is never screened. On `publish` and on editing a non-draft job, the title, description, requirements, benefits, hiring steps and screening questions (prompts and options) are checked against the active `JOB` filter words. A `SEVERE` match returns `400 VALIDATION_FAILED` with one `fieldErrors` entry per offending field (`description`, `hiringSteps[0]`, `screeningQuestions[1].prompt`, ...) naming the matched terms. A `MILD` match still publishes, and files one `SYSTEM` `JOB_POST` report (`INAPPROPRIATE`) in `/admin/reports` unless one is already `PENDING` for that job.
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
| `GET` | `/candidate/applications/applied-job-ids` | candidate | `number[]`: ids of jobs the caller has an application for (any status except `DRAFT` and `WITHDRAWN`). Used to show an Applied badge on job cards and an Applied button on the job detail page. |
| `GET` | `/candidate/applications/form?jobId=` | candidate | `ApplyFormResource { jobId, jobTitle, companyName, open, questions: [{ id, type, prompt, required, options? }], application? }`. `application` is the candidate's own draft or submission. `404` for a draft job. |
| `GET` | `/candidate/applications/{id}` | candidate | `ApplicationResource { id, status, jobId, jobTitle, companyId, companyName, resumeId?, cv?: { fileName, fileSizeBytes }, coverLetter?, answers: [{ questionId, prompt, answer }], history: [{ from?, to, actorType, at }], submittedAt?, viewedAt?, updatedAt }`. Someone else's application is `404`. |
| `PUT` | `/candidate/applications/draft` | candidate | Auto-save. Body `SaveApplicationRequest { jobId, resumeId?, coverLetter? (max 5000), answers?: [{ questionId, answer (max 1000) }] }`. Partial answers are allowed; answers to questions the job no longer has are dropped. `409 ALREADY_APPLIED` once submitted. |
| `POST` | `/candidate/applications` | candidate | Submit, same body, `resumeId` required. Every required question must be answered and a `CHOICE` answer must be one of the options (`400 VALIDATION_FAILED`, fields `answers[i]`). The chosen CV is copied at this moment, so later edits or deletion of the CV do not change the application. Notifies the job's recruiter. `409 ALREADY_APPLIED`, `422 JOB_NOT_OPEN`, `422 CANNOT_APPLY_TO_OWN_COMPANY`, `422 IDENTITY_NOT_VERIFIED`. |
| `POST` | `/candidate/applications/{id}/withdraw` | candidate | `422 INVALID_STATUS_TRANSITION` from a terminal status. |
| `POST` | `/candidate/applications/{id}/reapply` | candidate | Body `{ resumeId }`. Only from `WITHDRAWN`; the first answers and cover letter are kept, only the CV changes. |
| `GET` | `/candidate/applications/{id}/cv` | candidate | Streams the application's own CV copy. |

- A job belongs to the candidate's own company when a recruiter account with the same email is an active member of it; that is refused with `CANNOT_APPLY_TO_OWN_COMPANY`.
- `applications.require-identity-verification` (env `APPLICATIONS_REQUIRE_IDENTITY_VERIFICATION`, default `true`) turns on the eKYC gate: only candidates whose identity verification is `APPROVED` can apply.
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

Interview times (`startsAt`, `proposedStartsAt`) must be in the future and at most 30 days ahead (`400` otherwise).
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

## Identity verification (eKYC)

Candidates submit a national ID and a portrait; an admin reviews them by hand (no automatic scoring yet). Images live in the private `IDENTITY_DOCUMENT` store and are streamed only to admins. The ID number is stored as a SHA-256 hash plus its last 4 digits.

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/candidate/identity-verification` | candidate | `{ status?, rejectReason?, attemptsLeft, canSubmit, required, fullName?, idNumberLast4?, submittedAt?, reviewedAt? }`. `status` is absent until the first submission; `required` mirrors `applications.require-identity-verification`. |
| `POST` | `/candidate/identity-verification` | candidate | `multipart/form-data`: `fullName` (max 120), `idNumber` (9 or 12 digits), `dateOfBirth` (ISO date), files `front`, `back`, `selfie` (JPG/PNG, max 5MB each). Creates a `PENDING` review and notifies admins. `403 EMAIL_NOT_VERIFIED`, `409 IDENTITY_ALREADY_VERIFIED`, `409 IDENTITY_REVIEW_PENDING`, `422 IDENTITY_ATTEMPTS_EXHAUSTED`, `422 IDENTITY_UNDER_MINIMUM_AGE` (under 16). A rejected candidate resubmits with the same call. |
| `GET` | `/admin/identity-verifications?status=&q=&page=&size=` | admin | Paged `AdminIdentityVerificationResource { id, userId, userEmail, fullName, dateOfBirth, idNumberLast4, status, idNumberUsedByAnotherAccount, rejectReason?, rejectionCount, attemptLimit, submittedAt, reviewedAt? }`. Pending items are oldest first, others newest first. `q` matches name or last 4 digits. |
| `GET` | `/admin/identity-verifications/{id}` | admin | One item. |
| `GET` | `/admin/identity-verifications/{id}/documents/{FRONT\|BACK\|SELFIE}` | admin | Streams the image inline. |
| `POST` | `/candidate/identity-verification/manual-review` | candidate | After every attempt was rejected, asks an admin to look at the case once. Returns the status with `manualReviewRequestedAt`; notifies admins. `422 IDENTITY_MANUAL_REVIEW_UNAVAILABLE`, `409 IDENTITY_MANUAL_REVIEW_ALREADY_REQUESTED`. Granting attempts or resubmitting clears the request. |
| `POST` | `/admin/identity-verifications/{id}/approve` | admin | `PENDING` to `APPROVED`; notifies the candidate (`IDENTITY_VERIFIED`) and writes an audit entry. `409 IDENTITY_NUMBER_ALREADY_USED` when another account already holds the same approved ID number. |
| `POST` | `/admin/identity-verifications/{id}/reject` | admin | Body `{ reason }` (required, max 500). `PENDING` to `REJECTED`, counts one attempt, notifies the candidate (`IDENTITY_REJECTED`). |
| `POST` | `/admin/identity-verifications/{id}/grant-attempts` | admin | Adds 3 attempts to a rejected candidate who used all 5. |

Anything other than the stated source status returns `422 INVALID_STATUS_TRANSITION`.

## Service catalog (billing)

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/recruiter/service-packages` | recruiter | The whole buy-services page in one call: `ServiceCatalogResource { categories: [ServiceCategoryResource] }`. Only active categories that still hold at least one `ACTIVE` package are returned, categories and packages sorted by `displayOrder`. |
| `GET` | `/recruiter/service-packages/{slug}` | recruiter | `ServicePackageDetailResource`. `404 PACKAGE_NOT_AVAILABLE` when the slug is unknown, the package is not `ACTIVE`, or its category is inactive. |
| `GET` | `/admin/service-categories` | admin | `AdminServiceCategoryResource[]` including inactive ones, each with `packageCount` and `activePackageCount`. |
| `GET` | `/admin/service-categories/{id}` | admin | `AdminServiceCategoryResource`. |
| `POST` · `PUT` | `/admin/service-categories` · `/{id}` | admin | Body `SaveServiceCategoryRequest` (`needKey` in `REACH \| CONNECT \| HIGHLIGHT \| BRANDING` or omitted). `409 DUPLICATE_SERVICE_CATEGORY_CODE` when `code` is taken; `409 SERVICE_CATEGORY_CODE_LOCKED` if changing `code` while packages exist. |
| `PUT` | `/admin/service-categories/reorder` | admin | Body `{ items: [{ id, displayOrder }] }`. Updates category display order atomically and returns sorted `AdminServiceCategoryResource[]`. |
| `POST` | `/admin/service-categories/{id}/activate` · `/deactivate` | admin | Toggles category visibility (`isActive`). When hidden, all packages in that category are unavailable on detail, cart, voucher, and checkout endpoints. |
| `DELETE` | `/admin/service-categories/{id}` | admin | `409 SERVICE_CATEGORY_IN_USE` while any package still points at it. |
| `GET` | `/admin/service-packages?query=&categoryId=&status=&page=&size=` | admin | `PageResource<AdminServicePackageResource>`; `query` matches name or slug. |
| `GET` | `/admin/service-packages/{id}` | admin | `AdminServicePackageResource`. |
| `POST` · `PUT` | `/admin/service-packages` · `/{id}` | admin | Body `SaveServicePackageRequest`. `benefits` and `sections` are a **full replace**; omit them to clear. `409 DUPLICATE_PACKAGE_CODE` when `slug` is taken. |
| `POST` | `/admin/service-packages/upload-image` | admin | Multipart `file` (`JPEG`/`PNG`, max 5 MB). Returns `{ url, publicId }` stored in Cloudinary for hero or detail section artwork. |
| `POST` | `/admin/service-packages/{id}/activate` · `/deactivate` | admin | Packages are never deleted; a non-`ACTIVE` package disappears from the recruiter catalog. |

- `ServiceCategoryResource`: `{ id, code, name, headline, description, needKey, packages: [ServicePackageCardResource] }`. `needKey` is what the "suggest a package" modal maps a recruiter's chosen need onto (`REACH`, `CONNECT`, `HIGHLIGHT`, `BRANDING`); it is data, never hard-coded in the frontend.
- `ServicePackageCardResource`: `{ id, slug, name, shortDescription, price, currency, badge, vipRibbon, accentColor, validityDays, oneTimePerCompany, benefits }`. `badge` is `NONE`, `NEW` or `SPECIAL_OFFER`. `price` is an integer amount of `currency` (`VND`), **excluding VAT** — the UI shows it with the red asterisk.
- `ServicePackageDetailResource` adds `heroImageUrl`, `categoryCode`, `categoryName`, `categoryHeadline` and `sections: [{ heading, iconName, accentColor, body, imageUrl }]`, where `body` is markdown.
- `ServicePackageBenefitResource`: `{ entitlementType, quantity, durationDays, label }`. Time-boxed types (`JOB_POST_SLOT`, `JOB_LABEL_HOT`, `JOB_HIGHLIGHT`, `BRAND_PAGE`, `FEATURED_COMPANY`, `AD_SLOT_WEEK`) require `durationDays` in `1–3650` (`400 VALIDATION_FAILED` otherwise). `entitlementType` is the machine-readable right a purchase grants (`JOB_POST_SLOT`, `JOB_LABEL_HOT`, `JOB_HIGHLIGHT`, `JOB_ALERT_PUSH`, `AI_RESUME_MATCH`, `AI_JD_GENERATE`, `BRAND_PAGE`, `FEATURED_COMPANY`, `AD_SLOT_WEEK`); `label` is the Vietnamese line shown on the card. Updating a banner package price also syncs `AdSlot.pricePerWeek`.
- `SaveServicePackageRequest`: `{ categoryId, slug, name, shortDescription, price, currency, badge, vipRibbon, accentColor, heroImageUrl, validityDays, oneTimePerCompany, status, displayOrder, benefits: [{ entitlementType, quantity, durationDays, label }], sections: [{ heading, iconName, accentColor, body, imageUrl }] }`. `slug` (`^[a-z0-9-]+$`) is the package's only identifier string; the `oneTimePerCompany` repeat-purchase check keys off the package's numeric id, not a string code.
- Every admin write is audited (`SERVICE_CATEGORY_*`, `SERVICE_PACKAGE_*`).

## Cart and orders (billing)

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/recruiter/cart` | recruiter | `CartResource`. The cart belongs to the **recruiter**, not the company; it is created on first access. |
| `POST` | `/recruiter/cart/items` | recruiter | Body `{ packageId, quantity }` (1-99). Adding a package already in the cart increases its quantity (capped at 99). Max 20 distinct items → `422 CART_ITEM_LIMIT_EXCEEDED`. `404 PACKAGE_NOT_AVAILABLE` for a non-`ACTIVE` package. |
| `PATCH` | `/recruiter/cart/items/{id}` | recruiter | Body `{ quantity }`. `404 NOT_FOUND` for another recruiter's cart item; `422 AD_BANNER_QUANTITY_LOCKED` on ad slot items (whose quantity tracks the booked weeks). |
| `DELETE` | `/recruiter/cart/items/{id}` · `/recruiter/cart` | recruiter | Remove one line, or empty the cart. |
| `GET` | `/recruiter/orders?page=&size=` | recruiter | `PageResource<OrderSummaryResource>` of the **company's** orders, newest first — every recruiter of the company sees them all. |
| `GET` | `/recruiter/orders/summary` | recruiter | `OrderStatusCountsResource`: `{ total, byStatus: { PENDING_PAYMENT, UNDERPAID, PAID, FULFILLED, EXPIRED, CANCELLED, REFUND_REQUESTED, REFUNDED } }` for the company's orders. |
| `GET` | `/recruiter/orders/{code}` | recruiter | `OrderResource`. `404 NOT_FOUND` for another company's order. |
| `POST` | `/recruiter/orders` | recruiter | Checkout. Send `packageId` (+ optional `quantity`) to buy one package without touching the cart. Otherwise the cart is used: `cartItemIds` buys only those lines and leaves the rest in the cart, omitting it buys everything. |
| `POST` | `/recruiter/orders/{code}/cancel` | recruiter | Only the recruiter who created the order may cancel it (`403 FORBIDDEN` otherwise), and only while `PENDING_PAYMENT` or `UNDERPAID` (`422 ORDER_NOT_PAYABLE`). |

- `CartResource`: `{ items, subtotal, vatRate, vatAmount, totalAmount, currency }`. `CartItemResource`: `{ id, packageId, slug, name, shortDescription, unitPrice, currency, quantity, lineTotal, validityDays, oneTimePerCompany, adSlotItem, weeks }`.
- `CheckoutRequest`: `{ packageId?, quantity?, cartItemIds?, invoiceType: BUSINESS | PERSONAL, taxId?, companyName?, companyAddress?, fullName?, identityNumber?, personalAddress?, recipientEmail, termsAccepted }`. A `BUSINESS` invoice requires `taxId` and `companyName`; a `PERSONAL` invoice requires `fullName`; `termsAccepted` must be true. All three surface as `400 VALIDATION_FAILED`.
- **Money:** `totalAmount = (subtotal − discountAmount) + vatAmount`, where `vatAmount` is the VAT rate applied to the amount **after** discount and rounded `HALF_UP` to whole đồng. Catalog prices exclude VAT; the order stores all five figures plus the `vatRate` used, so changing the rate later never alters an existing order.
- **Ownership:** an order belongs to `company_id` and records `purchased_by_recruiter_id`. A recruiter with no company gets `403 NOT_COMPANY_MEMBER` on checkout and on every order read.
- **Order codes** are `IVO` + 8 characters from `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (0/O and 1/I omitted because customers retype the code into the bank transfer note).
- **Guards:** a repeated submit with the same total within 2 minutes returns the existing pending order instead of creating a second one — this runs *before* the purchase rules, so a retried click never surfaces `TRIAL_ALREADY_USED`. A company may hold at most 3 `PENDING_PAYMENT` orders (`422 TOO_MANY_PENDING_ORDERS`). A package flagged `oneTimePerCompany` cannot be bought twice (`422 TRIAL_ALREADY_USED`).
- Orders expire after `billing_settings.order_expire_hours` (default 72). A scheduler every 10 minutes moves overdue `PENDING_PAYMENT` orders to `EXPIRED`.
- `billing_settings` is a single row holding `vat_rate`, `order_expire_hours`, `order_code_prefix` and `max_pending_orders`.

## Payments (SePay)

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/recruiter/orders/{code}/payment` | recruiter | `OrderPaymentResource`. When the bank account is not configured yet it returns `configured: false` with every bank field `null` — the endpoint never fails for that reason. |
| `GET` | `/recruiter/orders/payments?page=&size=` | recruiter | `PageResource<PaymentTransactionResource>` of bank transfers matched to the company's orders, newest first. Always `MATCHED` from this view — an `UNMATCHED` transfer has no `matchedOrder` to join on. |
| `GET` | `/recruiter/orders/payments/summary` | recruiter | `PaymentTransactionSummaryResource`: `{ totalCount, totalAmount }` over every bank transfer matched to the company's orders. |
| `GET` · `PUT` | `/admin/payments/settings` | admin | `BillingSettingsResource` / `SaveBillingSettingsRequest`. `apiTokenConfigured` is read-only and reports whether `SEPAY_API_TOKEN` is present in the server environment. |
| `GET` | `/admin/payments/transactions?status=&page=&size=` | admin | `PageResource<PaymentTransactionResource>`, newest first. `status` is `MATCHED` or `UNMATCHED`. |
| `POST` | `/admin/payments/transactions/{id}/match` | admin | Body `{ orderCode, note? }`. Links an `UNMATCHED` transfer to an order by hand. `409 TRANSACTION_ALREADY_MATCHED`, `422 ORDER_NOT_PAYABLE`. |
| `POST` | `/admin/payments/sync` | admin | Runs reconciliation immediately and returns `PaymentSyncResultResource { at, ok, message, fetched, created, matched }`. Never throws for a misconfiguration; it answers `ok: false` with the reason. |

- `OrderPaymentResource`: `{ orderCode, status, totalAmount, paidAmount, currency, expiresAt, configured, bankCode, accountNumber, accountName, transferContent, qrUrl }`. `transferContent` is the order code — the recruiter must keep it intact for automatic matching. `qrUrl` points at `qr.sepay.vn` and carries the **outstanding** amount, so a top-up QR after a short payment is already correct.
- **Reconciliation** polls `https://my.sepay.vn/userapi/transactions/list` (no webhook). It is off until `billing_settings.payment_sync_enabled` is true, a bank account is saved and `SEPAY_API_TOKEN` is set.
- **Matching:** the transfer content is upper-cased and stripped of whitespace, then matched against `PREFIX[A-Z0-9]{8}`. Unknown code → the transfer is stored `UNMATCHED` for an admin to resolve.
- **Amount rules:** received totals at or above the order total mark it `PAID` (any overage is recorded in the transaction note); less marks it `UNDERPAID` and the order stays open until its expiry so the recruiter can top up with the same content.
- `payment_transactions.sepay_id` is `UNIQUE`: the same bank transfer can never be credited twice, even if two reconciliation runs overlap.
- **Notifications:** `ORDER_CREATED` goes to every active recruiter of the company, `ORDER_PAID` to the whole company, `ORDER_UNDERPAID` to the buyer.

## Entitlements (what a company owns)

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/recruiter/entitlements` | recruiter | `EntitlementResource[]` — the company's stock, newest purchase first. `activatable` says whether the recruiter applies it to a job by hand. |
| `GET` | `/recruiter/entitlements/active` | recruiter | `EntitlementUsageResource[]` — what is running right now and when each ends. |
| `POST` | `/recruiter/entitlements/{id}/activate` | recruiter | Body `{ jobId }`. Applies one unit to a published job of the company. **Irreversible.** |

- `EntitlementResource`: `{ id, entitlementType, label, totalQuantity, remainingQuantity, durationDays, status, activationDeadline, purchasedByRecruiterId, activatable, purchasedAt }`. `status` is `AVAILABLE`, `CONSUMED` or `EXPIRED`.
- **Grant:** a paid order is turned into entitlements in the same transaction that records the payment, then the order moves to `FULFILLED`. One row per benefit line, `quantity = benefit quantity × order item quantity`.
- **Clock:** `durationDays` starts at **activation**, not at payment. Unused stock dies at `activationDeadline` (12 months after purchase).
- **Activatable on a job:** `JOB_LABEL_HOT`, `JOB_HIGHLIGHT`. The target must be a `PUBLISHED` job of the same company and must not already carry the same service (`422 ADDON_REQUIRES_ACTIVE_JOB`, or `409 JOB_LABEL_CONFLICT` for `JOB_LABEL_HOT`). Anything else answers `422 ENTITLEMENT_NOT_ACTIVATABLE`.
- **Job slots** are not activated by hand: publishing a job consumes one `JOB_POST_SLOT` automatically, oldest-deadline first. Resuming a paused job never costs a second slot. When `billing.require-job-slot` is `false` (the default) publishing still succeeds without stock; set `BILLING_REQUIRE_JOB_SLOT=true` to make a slot mandatory (`422 ENTITLEMENT_EXHAUSTED`).
- **Concurrency:** stock is decremented with one conditional `UPDATE ... WHERE remaining_quantity >= ?`, so two publishes racing for the last slot cannot both win.
- **Expiry:** a 1-minute scheduler (`0 * * * * *`) ends usages whose window has passed and clears the matching job effect (keeping active label safe when another label already replaced it). **The job stays published** — only the paid display effect stops. Unused stock past its deadline flips to `EXPIRED`.
- `jobs` has `highlight_label`, `highlight_label_expires_at`, `highlighted`, `highlight_expires_at`.

## AI recruiter tools & quota

| Method | Path | Auth | Notes |
|---|---|---|---|
| `POST` | `/recruiter/ai/resume-match` | recruiter | Moved out of `/ai/**`: `SecurityConfig` denies recruiter tokens outside `/api/v1/recruiter/**`, so the old path answered `403` for everyone. |
| `POST` | `/recruiter/ai/applications/{id}/resume-match` | recruiter | No body. The server resolves job title, requirements (one per line of `jobs.requirements`, max 25) and CV text from the application itself, so the client cannot invent requirements. `404` when the application is not in the recruiter's company, `422 JOB_REQUIREMENTS_MISSING` / `CV_TEXT_NOT_READABLE`. |
| `GET` | `/recruiter/ai/resume-match/quota` | recruiter | `{ freeUsedThisMonth, freeLimit, freeRemaining, paidRemaining, totalRemaining, resetAt }`. |
| `GET` | `/recruiter/ai/jd-generate/quota` | recruiter | `{ freeUsedThisMonth, freeLimit, freeRemaining, paidRemaining, totalRemaining, resetAt }`. |
| `POST` | `/recruiter/ai/jd-generate` | recruiter | Body `JdGenerateRequest { title, level?, contractType?, workingArrangement?, city?, skills?, language?, notes? }` → `JdGenerateResult { description, requirements, benefits, model, promptVersion, generatedAt }`. |

- **Free tier plus top-up.** Each company gets `ai.quota.resume-match-free-per-month` analyses a month (default 30, Redis key `ai:quota:resume_match:{companyId}:{yyyy-MM}`) and `ai.quota.jd-generate-free-per-month` JD drafts a month (default 10, Redis key `ai:quota:jd_generate:{companyId}:{yyyy-MM}`), resetting at the first of the month Vietnam time. Beyond that, one `AI_RESUME_MATCH` or `AI_JD_GENERATE` entitlement unit is spent after the model succeeds. With neither left the call answers `422 AI_USER_QUOTA_EXCEEDED`.
- Quota is **checked before** the model call and **spent after** it succeeds, so a failed call never costs a paid unit (`AiQuotaReservation` style). The existing per-user daily AI quota (`ai.quota.user-per-day`) still applies on top and covers the gap between check and spend.
- These controllers are **synchronous**. Returning `CompletableFuture` made Spring Security re-evaluate the `ASYNC` dispatch without a `SecurityContext`, which answered `401` even when the analysis had succeeded and the quota had already been spent.

## Paid company branding

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/companies/featured?limit=` | public | `FeaturedCompanyResource[]` `{ id, name, logoUrl, industry }` — companies whose `featured_until` is still in the future, newest window first. Max `limit` 20. |

- `GET /recruiter/company` now also returns `photoLimit`, `brandPageUntil`, `featuredUntil`. The limit is **3 photos** on the free tier and **10** while a `BRAND_PAGE` window is open; `addPhotos` enforces the same number.
- `FEATURED_COMPANY` and `BRAND_PAGE` are activated **on the company**, so `POST /recruiter/entitlements/{id}/activate` accepts an empty body for them. Buying again while a window is open **extends** it instead of restarting it.
- The home page lists featured companies first and fills the remaining slots from recent job posts, so the section never looks empty before anyone has bought the slot.

## Vouchers, invoices and refunds

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET`/`PUT` | `/admin/free-quotas` | admin | Reads or updates runtime free-tier limits (`aiResumeMatchFreePerMonth`, `aiJdGenerateFreePerMonth`, `cvReviewFreePerDay`, `candidateStarterCredits`, `connectDailyInviteLimit`, `companyFreePhotoLimit`, `requireJobSlot`, `jobFreeActiveLimit` 0-100, `jobFreeMaxDays` 1-365, `jobReviewFirstCount` 0-100). Without a paid slot a job can stay open at most `jobFreeMaxDays` days from its publish date. Audited as `FREE_QUOTA_SETTINGS_UPDATED`. |
| `GET` | `/recruiter/vouchers?packageId=` | recruiter | Lists active, non-exhausted vouchers usable by the recruiter's company (sorted soonest expiry first), optionally filtered to vouchers valid for `packageId`. Includes `ribbonLabel`, `accentColor`, `conditions[]`, and `applicablePackages[]`. |
| `GET` | `/recruiter/vouchers/available?page=&size=` | recruiter | `PageResource<AvailableVoucherResource>` for the Recruiter coupon wallet ("Có hiệu lực"). |
| `GET` | `/recruiter/vouchers/used?page=&size=` | recruiter | `PageResource<UsedVoucherResource>` of company voucher redemptions excluding `CANCELLED` / `EXPIRED` orders ("Đã sử dụng"). |
| `POST` | `/recruiter/vouchers/validate` | recruiter | `{ code, cartItemIds[] }` or `{ code, packageId, quantity }` → the discount preview calculated on eligible package lines (`422 VOUCHER_NOT_APPLICABLE` if restricted to other packages). |
| `GET`/`POST`/`PUT` | `/admin/vouchers[/{id}]` | admin | Filterable by `keyword`, `status`, `discountType`; includes `ribbonLabel`, `accentColor`, `conditions[]`, and `applicablePackageIds[]`. Code is never rewritten after creation. `POST /admin/vouchers/{id}/activate` and `/deactivate` toggle availability. |
| `GET` | `/recruiter/orders/{code}/invoice` | recruiter | VAT invoice metadata. `422 INVOICE_NOT_ISSUED_YET` until the order is paid. |
| `GET` | `/recruiter/orders/{code}/invoice/pdf` | recruiter | `application/pdf`, always available. Once `PAID`/`FULFILLED`/`REFUND_REQUESTED`/`REFUNDED`, the real numbered VAT invoice. For `PENDING_PAYMENT`, `UNDERPAID` or `CANCELLED` (no invoice issued yet), an **order confirmation** document instead — same layout and InterVue logo, titled "ORDER CONFIRMATION" with a status line underneath (`AWAITING PAYMENT` / `UNDERPAID` / `CANCELLED`), no invoice number, so a recruiter can show it to their finance team before or instead of payment. Still `404 NOT_FOUND` for `EXPIRED` and other statuses with neither document. |
| `GET` | `/admin/invoices`, `/admin/invoices/{id}/pdf` | admin | Every issued document. |
| `GET` | `/recruiter/orders/refunds?page=&size=` | recruiter | `PageResource<RefundRequestResource>` of the company's refund requests, newest first. |
| `GET` | `/recruiter/orders/refunds/summary` | recruiter | `RefundStatusCountsResource`: `{ total, byStatus: { PENDING, APPROVED, REJECTED } }` for the company's refund requests. |
| `GET`/`POST` | `/recruiter/orders/{code}/refund` | recruiter | `GET` quotes what would come back; `POST` submits `{ reason }`. |
| `GET` | `/admin/refunds` | admin | Optional `?status=PENDING\|APPROVED\|REJECTED`. |
| `POST` | `/admin/refunds/{id}/approve`, `/reject` | admin | `{ approvedAmount?, adminNote? }`. Audited as `REFUND_APPROVED` / `REFUND_REJECTED`. |
| `GET` | `/admin/orders` | admin | Filters `code`, `status`, `companyId`, `from`, `to`; paginated. |
| `GET` | `/admin/orders/{code}` | admin | One order with its lines. |
| `GET` | `/admin/orders/revenue` | admin | `{ collectedTotal, refundedTotal, netTotal, pendingTotal, paidOrderCount, ordersByStatus, byMonth, byPackage }`. |

- **Entitlement activation deadlines.** When `order_items.validity_days` is `null`, `activation_deadline` is `null` (no expiry); when finite, it is at least a 365-day activation window from grant (`EntitlementExpiryScheduler` flips overdue lots to `EXPIRED`). FIFO spend always draws soonest-expiring lots before perpetual (`NULL`) lots.
- **Vouchers:** VAT is charged on the amount **after** the discount. When `voucher_applicable_packages` is non-empty, only cart/order lines matching those packages qualify toward `min_order_value` and receive the discount (`422 VOUCHER_NOT_APPLICABLE` if none qualify). `voucher_redemptions.order_id` is UNIQUE, so one order carries one voucher and can never claim it twice. Cancelling or expiring an order releases the redemption and decrements `used_count`. **A refund does not release it** — the buyer did use the offer and did receive the services; only the part never activated comes back as money.
- **Invoices** are issued inside the same transaction that grants the entitlements, so a paid order can never end up without one. The number is derived from the key (`INV-{year}-{id}`), which needs no lock; a gap only means a rolled-back order. The document is rendered on demand from the stored snapshot, never saved to disk. It is an **internal record**, not an e-invoice carrying a tax authority code — that needs a registered business, a digital certificate and a provider contract.
- **Revenue is counted, never estimated.** `collectedTotal` sums `paid_amount` over every order that money reached — including refunded ones, because the money did arrive — while `refundedTotal` sums the **approved** refund amounts, so `netTotal` is what the platform actually still holds. `pendingTotal` is what open orders still owe. Months with no collection simply do not appear.
- **Refunds return only what was never activated.** Lots from an order item are weighted equally by unit count, and bonus gifts (`is_bonus = true`) cannot generate a refund once all core benefits of that order item are consumed; the result is then scaled by `subtotal_after_discount / subtotal` so a discounted order cannot be over-refunded. Approving revokes the untouched units (`EntitlementStatus.REVOKED`), records a ledger revocation entry, and leaves anything already running on a job alone. **The system never moves money** — SePay's user API has no payout; an admin makes the transfer by hand and records the amount.

## Banner advertising

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/ads/slots/{code}` | **public** | The banner running this ISO week, the house ad when nobody bought it, or `null` when the slot has neither. Counts an impression in Redis. |
| `POST` | `/ads/slots/{code}/click` | **public** | One click per IP per slot per minute is counted; the rest are dropped. |
| `GET` | `/recruiter/ads/slots` | recruiter | Every slot on sale with its size and weekly price. |
| `GET` | `/recruiter/ads/slots/{code}/calendar?weeks=` | recruiter | Which weeks are free, and which are already the caller's. |
| `GET` | `/recruiter/ads/bookings` | recruiter | The company's weeks with artwork status and totals. |
| `POST` | `/recruiter/ads/bookings/{id}/creative` | recruiter | `multipart/form-data`: `file` plus a `data` part `{ targetUrl, altText }`. |
| `GET`/`POST`/`PUT` | `/admin/ads/slots[/{id}]` | admin | List, create (`CreateAdSlotRequest`: auto-creates `BANNER_<CODE>` package when `servicePackageId` is omitted; audited as `AD_SLOT_CREATED`), or update price (`pricePerWeek` syncs linked `ServicePackage.price`), description, house ad and whether on sale (`AD_SLOT_UPDATED`). |
| `GET` | `/admin/ads/creatives?status=` | admin | Artwork queue. |
| `POST` | `/admin/ads/creatives/{id}/approve`, `/reject` | admin | Audited as `AD_CREATIVE_APPROVED` / `AD_CREATIVE_REJECTED`. |

- **Inventory is whole ISO weeks**, never arbitrary date ranges. That turns overlap checking into `UNIQUE (ad_slot_id, week_start)` and lets the database settle a tie between two buyers instead of application locking. The current week is never on sale — it is already running.
- **Weeks are held the moment the order is placed** (`RESERVED`), become `BOOKED` when the money arrives, and are deleted when the order is cancelled or expires. A row is deleted rather than flagged because a `RELEASED` row would keep holding the unique key. An `UNDERPAID` order keeps its hold until the order itself expires — the buyer did send real money.
- **A banner is bought through the normal cart**, so it shares one checkout, VAT, voucher, invoice and refund path with every other package. The chosen weeks ride along in `cart_items.meta_json` / `order_items.meta_json`; quantity must equal the number of weeks.
- **Nothing goes live unreviewed.** Every upload, including a replacement, returns to `PENDING`. A week whose artwork is not approved in time shows the house ad and is **not** extended.
- **Views never touch the database.** Impressions and clicks accumulate in Redis and a job flushes them into `ad_metrics` every five minutes.

## InterVue Connect

Chat between a Candidate and a company's Recruiters (`modules/connect`). A `connection` is one per
`(candidate, company)` pair, not per job. Wave 1 built the invitation lifecycle; wave 2 added free
messaging, attachments, link preview, block and the content filter; wave 3 added real-time delivery,
the unread counter and the human-facing report endpoint; wave 4 added the admin report queue,
hide-content and lock-account; wave 5 (below) is the recruiter frontend plus the two backend additions
it needed. Candidate frontend is still to come (wave 6).

**Lifecycle (wave 1)**

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/recruiter/connect/eligible-candidates?search=` | recruiter | Candidates who have at least one non-draft `Application` to the recruiter's company and have no `connection` with it yet. `EligibleCandidateResource { candidateId, fullName, email, jobTitle, submittedAt }`. |
| `POST` | `/recruiter/connect/invitations` | recruiter | Body `{ candidateId, message (max 1000) }`. Screened via content filter & mute check before reserving quota. Creates a `PENDING` connection (or re-opens a `DECLINED` connection up to `2` total invites per pair after a `24h` cooldown from `respondedAt`) plus its opening message, charges the daily quota, notifies the candidate (`CONNECT_INVITATION_RECEIVED`) and emits SSE `status` (`PENDING`). `403 CONNECT_MUTED`, `409 CONNECTION_ALREADY_EXISTS` (if `PENDING`/`ACCEPTED`/`BLOCKED`), `409 CONNECTION_INVITE_LIMIT_REACHED`, `422 MESSAGE_BLOCKED_BY_FILTER`, `422 NOT_ELIGIBLE_TO_CONNECT`, `429 CONNECTION_QUOTA_EXCEEDED`, `429 CONNECTION_REINVITE_COOLDOWN` (`Retry-After`). |
| `GET` | `/recruiter/connect/conversations` | recruiter | Company-wide, `PENDING` + `ACCEPTED` + `DECLINED` + `BLOCKED`, paged by `lastMessageAt` descending. |
| `GET` | `/candidate/connect/invitations` | candidate | Own `PENDING` invitations, each with the opening message. |
| `POST` | `/candidate/connect/invitations/{id}/accept` | candidate | `PENDING` to `ACCEPTED`; notifies the inviting recruiter (`CONNECT_INVITATION_ACCEPTED`). `404 NOT_FOUND` if not owned or not `PENDING`. |
| `POST` | `/candidate/connect/invitations/{id}/decline` | candidate | `PENDING` to `DECLINED`; clears candidate unread, notifies the inviting recruiter (`CONNECT_INVITATION_DECLINED`), and emits SSE `status` (`DECLINED` with `inviteCount`, `maxInvites`, `reinviteAvailableAt`). After the first decline, recruiters may re-invite once after `24h`; the second decline locks the pair. |
| `GET` | `/candidate/connect/conversations` | candidate | Own `ACCEPTED` + `BLOCKED` connections, paged by `lastMessageAt` descending. |

- **Quota**: 100 new invitations per calendar day (Asia/Ho_Chi_Minh), counted **per recruiter**, not per company. Declining later does not refund it.
- **Eligibility is a port**: `connect` depends on `CandidateEligibilityPortInterface`, implemented in `application` off the existing `Application` rows (already carry `candidateName`/`candidateEmail`, no call into `candidate` needed). A Candidate Search module can plug in as a second source later without touching `connect`.
- **Ownership checks return `404`**, never a connect-specific error code, matching the IDOR pattern used everywhere else.

**Messaging, attachments, link preview, block (wave 2)** — same `{candidate|recruiter}` prefix as above:

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/connect/conversations/{id}` | both | Fetches a single `ConversationSummaryResource` (carrying numeric `id`, UUID `publicId`, `peerLastReadMessageId`, `peerLastReadAt`, `blockedByActorType`) for deep-link / reload recovery. Accepts either numeric `id` or UUID `publicId` (frontend routes use `/candidate/conversations/{publicId}` and `/recruiter/conversations/{publicId}`). |
| `POST` | `/connect/conversations/{id}/messages` | both | Body `{ body (max 2000), clientMessageId?, replyToMessageId?, suppressLinkPreview? }`. Idempotent on `(connection_id, sender_type, sender_id, clientMessageId)`. `messageType` is `LINK` if the text contains a fetchable URL and `suppressLinkPreview` is not true, else `TEXT`. `422 CONNECTION_NOT_ACCEPTED`, `403 CONNECTION_BLOCKED`, `403 CONNECT_MUTED`, `422 MESSAGE_BLOCKED_BY_FILTER` (generic message only — never the matched word). |
| `POST` | `/connect/conversations/{id}/messages/attachment` | both | `multipart/form-data`: `file` (JPEG/PNG → `IMAGE`, PDF/DOCX → `FILE`), optional `caption` (screened like a text body), `clientMessageId`, `replyToMessageId`. `400 UNSUPPORTED_FILE_TYPE`, `400 FILE_TOO_LARGE`. |
| `PATCH` | `/connect/conversations/{id}/messages/{messageId}` | both | Body `{ body (max 2000), suppressLinkPreview? }`. Original sender can edit `TEXT`/`LINK` messages within 15 minutes of `createdAt`, re-running content filter and link preview resolution, setting `editedAt`, and emitting SSE `message_updated`. `422 MESSAGE_EDIT_WINDOW_EXPIRED`, `422 MESSAGE_NOT_EDITABLE`, `409 MESSAGE_ALREADY_RECALLED`. |
| `POST` | `/connect/conversations/{id}/messages/{messageId}/unsend` | both | Body `{ scope: ME \| EVERYONE }`. `ME` hides the message only for the caller (`connection_message_hides`); `EVERYONE` is allowed anytime for the original sender on non-recalled `ACCEPTED` messages, clearing content/attachments, setting `recalledAt`, and emitting SSE `message_updated`. |
| `POST` | `/connect/conversations/{id}/messages/{messageId}/reactions` | both | Body `{ emoji }` (`👍`, `❤️`, `😂`, `😮`, `😢`, `🙏`). Toggles or switches the caller's reaction and emits SSE `reaction` (`{ connectionId, messageId, reactions[] }`). `400 CONNECT_REACTION_INVALID`. |
| `GET` | `/connect/conversations/{id}/messages?beforeId=&page=&size=` | both | Cursor (`beforeId`) + page-based history, newest first, excluding rows hidden for the actor; does **not** clear unread counts on read fetch. History stays readable even on a `BLOCKED` connection. |
| `GET` | `/connect/conversations/{id}/messages/{messageId}/attachment` | both | Streams a `FILE`-type attachment through the backend (signed Cloudinary fetch, same pattern as CV/identity documents) — `IMAGE` attachments are served directly via the public `attachmentUrl` in the message instead. `404 NOT_FOUND` if hidden, recalled, or not a `FILE` attachment of that connection. |
| `POST` | `/connect/conversations/{id}/read` | both | Body `{ lastReadMessageId? }`. Advances `candidate_last_read_message_id` / `recruiter_last_read_message_id`, clears Redis unread for the conversation, and emits SSE `read` (`{ connectionId, readerType, readerId, lastReadMessageId, lastReadAt }`). |
| `POST` | `/connect/conversations/{id}/typing` | both | Body `{ typing: boolean }`. Ephemeral typing indicator push via SSE `typing` (`{ connectionId, actorType, actorId, actorName, typing }`, no DB write). |
| `POST` | `/connect/conversations/{id}/block` | both | `ACCEPTED` → `BLOCKED`; records `blockedByActorType`/`blockedByActorId` and emits SSE `status`. `422 CONNECTION_NOT_ACCEPTED` while still `PENDING`/`DECLINED`. |
| `POST` | `/connect/conversations/{id}/unblock` | both | `BLOCKED` → `ACCEPTED` when called by the original blocking side (`blockedByActorType`), emitting SSE `status`. `409 CONNECTION_NOT_BLOCKED`. |
| `GET` | `/connect/link-preview?url=` | both | Resolves OpenGraph/Twitter/favicon metadata (`title`, `description`, `imageUrl`) using safe 3-hop SSRF-guarded redirects and absolute `absUrl` resolution (`connect:link-preview:v2:` Redis cache). |

- **Content filter runs on every `body`/`caption` before persisting**, against the admin-managed `connect_filter_words` list. A match is never silently dropped: it's recorded in `connect_violations`, counted per severity against a 30-day strike window (5 `MILD` or 3 `SEVERE` → 24h mute), and every `SEVERE` match (from the 1st offense) auto-files a `PENDING` report (`reporter_type = SYSTEM`) into the generic moderation queue — all **before** the request fails with `422 MESSAGE_BLOCKED_BY_FILTER`, so the evidence survives the rejection.
- **Muting is Connect-only**, not an account ban — `connect_mutes`, first offense 24h, a repeat offense after a mute has expired extends it to 7 days (same row, "extend don't restart").
- **Link preview** fetches `og:title`/`og:description`/`og:image` (Jsoup, 2s timeout, up to 3 SSRF-validated redirects, `absUrl` relative path resolution, plus `twitter:image` and favicon fallbacks), resolving the host via `PrivateNetworkGuard` before every hop. Cached in Redis 7 days under `connect:link-preview:v2:{sha256}`.
- **Chat `FILE` (PDF) delivery** requires the Cloudinary account's "Restricted media types" setting to allow authenticated raw delivery — a dashboard/account setting, not a code path; already enabled on this project's account and verified working end to end.

**Real-time, unread counter, report (wave 3)** — same `{candidate|recruiter}` prefix:

| Method | Path | Auth | Notes |
|---|---|---|---|
| `GET` | `/connect/stream` | both | `text/event-stream`, no `ApiResource` envelope. Published `@TransactionalEventListener(phase = AFTER_COMMIT)` via `ConnectSseDispatchEvent`: emits `message`, `message_updated` (full `MessageResource` JSON), `reaction` (`ConnectReactionEventPayload`), `read` (`ConnectReadEventPayload`), `typing` (`ConnectTypingEventPayload`), and `status` (`ConnectStatusEventPayload { connectionId, status, blockedByActorType, invitedAt, respondedAt, inviteCount, maxInvites, reinviteAvailableAt }`), plus a `:ping` comment every 20s to keep the connection alive through proxies. In-memory emitter registry — **single backend instance only**, no Redis pub/sub fan-out yet. |
| `GET` | `/connect/mute-status` | both | `ConnectMuteStatusResource { muted, expiresAt, reason }`. Returns active Connect mute status for the signed-in actor. |
| `GET` | `/connect/unread-count` | both | `ConnectUnreadCountResource { total, unreadMessages, pendingInvitations }`. Candidate `total` includes `unreadMessages + pendingInvitations`; Recruiter counts unread company messages. Backed by Redis hash `connect:unread:{actorType}:{actorId}` + live pending invitation query, cleared per-connection on explicit `POST .../read`. |
| `POST` | `/connect/conversations/{id}/report` | both | Body `{ reasonCode, reasonNote (max 1000) }`. Files a `PENDING` row into the generic `moderation` report queue (`reporter_type = CANDIDATE`/`RECRUITER`, the real actor this time, unlike the filter's `SYSTEM` auto-reports). Valid on a connection in **any** status — you often report right when blocking someone. Does **not** change `connections.status`. |

- **Recipient resolution**: a candidate's message pushes to **every active member of the recruiting company** (`findActiveMemberIds`) — matches the shared company-wide mailbox model; a recruiter's message pushes to the one candidate.
- **This is the first real-time push infra in the project** — notification delivery (`frontend/hooks/useNotifications.ts`) is plain 60s polling, not SSE. Connect's channel is independent of it on purpose (different domain, per the original design table).

**Admin report queue (wave 4)** — `modules/moderation`, `@PreAuthorize("hasRole('ADMIN')")`:

| Method | Path | Notes |
|---|---|---|
| `GET` | `/admin/reports?targetType=&status=&page=&size=` | Both filters optional (`Specification`, never string-concatenated). `targetType` is `CONVERSATION` or `JOB_POST`. `AdminReportSummaryResource` per row. |
| `GET` | `/admin/reports/{id}` | `AdminReportDetailResource` — the report's own fields only (reporter, target, reason, status, admin note, reviewed by/at). No embedded conversation content. |
| `GET` | `/admin/connect/conversations/{id}/messages?page=&size=` | **Separate endpoint, inside `connect`** (not `moderation` — `moderation` never imports `connect`). Full, **never-redacted** history regardless of block/hide state, so admin can actually read what happened before deciding. `404 NOT_FOUND` if the connection doesn't exist. |
| `POST` | `/admin/reports/{id}/dismiss` | Body `{ note? }`. `status` → `DISMISSED`. `404 NOT_FOUND`, `409 REPORT_ALREADY_REVIEWED` if not `PENDING`. |
| `POST` | `/admin/reports/{id}/resolve` | Body `{ action: NONE\|HIDE_CONTENT\|LOCK_ACCOUNT, note?, lockActorType?, lockActorId? }`. `status` → `ACTION_TAKEN`. Same `404`/`409` as dismiss. For a `JOB_POST` report only `NONE` and `HIDE_CONTENT` are allowed (`HIDE_CONTENT` hides the job as `HIDDEN_BY_ADMIN`, using `note` as the reason and notifying the recruiter); `LOCK_ACCOUNT` returns `400` on the field `action`. |
| `GET` | `/admin/connect/filter-words?scope=&page=&size=` | Paged list of automated content filter rules. `scope` is `CONNECT` (default, messaging) or `JOB` (job post content). |
| `POST` | `/admin/connect/filter-words` | Body `{ pattern, scope?: CONNECT\|JOB (default CONNECT), regex, severity: MILD\|SEVERE, active, note? }`. Creates a filter rule. For `JOB`, matching ignores letter case and accents and is by whole phrase; a short accented word (under 6 letters, single word) is also matched only with its accents so it cannot collide with ordinary words; regex patterns run against accent-free lowercase text. |
| `PUT` | `/admin/connect/filter-words/{id}` | Updates pattern, regex flag, severity, active state, or note. |
| `DELETE` | `/admin/connect/filter-words/{id}` | Deletes a filter rule. |
| `PATCH` | `/admin/connect/filter-words/{id}/toggle` | Toggles the active status of a filter rule. |

- **`HIDE_CONTENT`** sets `connections.content_hidden_at` (via a `moderation → connect` port, same declare-in-consumer/implement-in-owner shape as `entitlement`↔`job`/`company`). From that point, `GET .../messages` for the **candidate and recruiter** on that connection returns every message with `body`/attachment/link fields stripped to `null` — only `id`/`senderType`/`senderId`/`messageType`/`createdAt` survive. The admin endpoint above is the one exception, by design.
- **`LOCK_ACCOUNT` resolves the offender automatically if `lockActorId` is omitted** (for `SYSTEM` reports via the note's actor tag, or for human `CONVERSATION` reports by picking the reported participant), while still allowing admins to override `lockActorType` (`CANDIDATE`/`RECRUITER`) and `lockActorId` explicitly. `CANDIDATE` reuses the existing ban flow (`UserAdminServiceInterface.restrict`, a real `UserRestriction` row, session killed, user notified). `RECRUITER` calls the **first-ever** `RecruiterServiceInterface.suspend(...)` — sets `RecruiterStatus.SUSPENDED`, kills the session, revokes refresh tokens; `RecruiterAuthService`'s existing `ensureSignInAllowed` check now actually rejects login for the first time (that enum value existed with nothing that ever set it). No restriction-history table or un-suspend path for recruiters yet — deliberately out of scope, same minimal-fix spirit as the gap note that asked for this.
- **Every dismiss/resolve notifies the reporter** (`REPORT_DISMISSED`/`REPORT_RESOLVED`, resolved from the report's own `reporterType` — no cross-module lookup) and writes one `AuditAction.REPORT_DISMISSED`/`REPORT_RESOLVED` entry (`AuditTargetType.REPORT`, detail = the action taken).

**Recruiter frontend (wave 5)** — two small additive backend changes the UI needed, both found missing
from the wave 1 design during implementation:

| Method | Path | Notes |
|---|---|---|
| `GET` | `/recruiter/connect/rules-ack` | `ConnectRulesAckResource { acknowledged, acknowledgedAt }`. Per-account, backed by `connect_rules_acknowledgements` (`UNIQUE(actor_type, actor_id)`). |
| `POST` | `/recruiter/connect/rules-ack` | Idempotent — acknowledging twice keeps the first `acknowledgedAt`. |
| `GET` | `/candidate/connect/rules-ack` | `ConnectRulesAckResource { acknowledged, acknowledgedAt }`. Candidate's mirror. |
| `POST` | `/candidate/connect/rules-ack` | Idempotent — acknowledges the rules for candidate. |

- **`ConversationSummaryResource` fields**: includes `unreadCount`, `lastMessageAt`, `lastMessagePreview`, `blockedByActorType`, `peerLastReadMessageId`, and `peerLastReadAt`. Latest visible previews (excluding rows in `connection_message_hides` for the current actor) are loaded in batch via `findLatestVisibleByConnectionIdsForActor` and use English labels (`"Sent an image"`, `"Sent an attachment"`, `"Message unsent"`, `"Content has been hidden"`), link title for `LINK`, or truncated body for `TEXT`. Both recruiter and candidate conversation endpoints populate these fields.

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
| `JOB_REQUIREMENTS_MISSING` | 422 | The job has no requirement lines, so there is nothing for the AI to match against |
| `CV_TEXT_NOT_READABLE` | 422 | The CV attached to the application could not be read as text (scanned image, corrupt file) |
| `PACKAGE_NOT_AVAILABLE` | 404 | Unknown slug/id, or the service package is not `ACTIVE` |
| `INSUFFICIENT_CREDITS` | 422 | The candidate does not hold enough AI credits for this action |
| `AD_SLOT_NOT_FOUND` | 404 | Unknown or inactive advertising slot |
| `AD_SLOT_UNAVAILABLE` | 409 | Another buyer took one of the chosen weeks first |
| `AD_WEEKS_REQUIRED` | 422 | A banner line was submitted without any week |
| `AD_BOOKING_NOT_READY` | 422 | Artwork can only be uploaded once the order is paid |
| `AD_CREATIVE_ALREADY_REVIEWED` | 409 | The artwork was already approved or rejected |
| `VOUCHER_NOT_FOUND` | 404 | Unknown code |
| `VOUCHER_NOT_USABLE` | 422 | Inactive, not started yet, or past its end date |
| `VOUCHER_EXHAUSTED` | 422 | The total redemption limit is used up |
| `VOUCHER_ALREADY_USED` | 422 | The company hit its per-company limit |
| `VOUCHER_MIN_ORDER_NOT_MET` | 422 | The order is below the voucher's minimum |
| `VOUCHER_NOT_APPLICABLE` | 422 | No selected package qualifies for this voucher |
| `DUPLICATE_VOUCHER_CODE` | 409 | A voucher already uses this code |
| `INVOICE_NOT_ISSUED_YET` | 422 | `GET .../invoice` (JSON) only: no VAT invoice exists yet for an unpaid order — `.../invoice/pdf` never returns this (see below) |
| `ORDER_NOT_REFUNDABLE` | 422 | Only a `PAID` or `FULFILLED` order can be refunded |
| `REFUND_ALREADY_REQUESTED` | 409 | This order already has a refund request |
| `REFUND_ALREADY_REVIEWED` | 409 | The request was already approved or rejected |
| `NOTHING_LEFT_TO_REFUND` | 422 | Every service on the order has been activated |
| `DUPLICATE_PACKAGE_CODE` | 409 | A service package already uses this `slug` |
| `SERVICE_CATEGORY_IN_USE` | 409 | The category still has packages and cannot be deleted |
| `BILLING_NOT_CONFIGURED` | 503 | `billing_settings` has no row |
| `CART_EMPTY` | 422 | Checkout with nothing to buy |
| `CART_ITEM_LIMIT_EXCEEDED` | 422 | More than 20 distinct packages in the cart |
| `TOO_MANY_PENDING_ORDERS` | 422 | The company already holds the maximum unpaid orders |
| `ORDER_NOT_PAYABLE` | 422 | The order is not in a state that allows this action |
| `ORDER_EXPIRED` | 422 | The payment window has closed |
| `TRIAL_ALREADY_USED` | 422 | A one-time-per-company package was bought before |
| `PAYMENT_NOT_CONFIGURED` | 503 | `SEPAY_API_TOKEN` or the bank account is missing |
| `PAYMENT_PROVIDER_ERROR` | 502 | SePay answered with an error or an unexpected payload |
| `PAYMENT_SYNC_RUNNING` | 409 | A reconciliation run is already in progress |
| `TRANSACTION_ALREADY_MATCHED` | 409 | The bank transfer is already linked to an order |
| `ENTITLEMENT_EXHAUSTED` | 422 | No units of this service remain |
| `ENTITLEMENT_EXPIRED` | 422 | The activation deadline has passed |
| `ENTITLEMENT_NOT_ACTIVATABLE` | 422 | This service is consumed automatically, not applied by hand |
| `ADDON_REQUIRES_ACTIVE_JOB` | 422 | Target is not a published job of the company, or already has this service |
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
| `IDENTITY_ALREADY_VERIFIED` | 409 | The candidate is already verified |
| `IDENTITY_REVIEW_PENDING` | 409 | A submission is already awaiting review |
| `IDENTITY_ATTEMPTS_EXHAUSTED` | 422 | All 5 attempts were rejected; an admin must grant more |
| `IDENTITY_MANUAL_REVIEW_UNAVAILABLE` | 422 | A manual review can be requested only after all attempts were rejected |
| `IDENTITY_MANUAL_REVIEW_ALREADY_REQUESTED` | 409 | A manual review request is already waiting |
| `IDENTITY_UNDER_MINIMUM_AGE` | 422 | Date of birth shows the candidate is under 16 |
| `IDENTITY_NUMBER_ALREADY_USED` | 409 | The ID number is already approved on another account |
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
| `RATE_LIMITED` | 429 | Honor `Retry-After`. Global `RateLimitFilter`: 10/min per IP on login, register, forgot/reset-password and verify-2fa; 20/min per account on `/ai/**`; 300/min per account or IP on `/api/**` |
| `AI_USER_QUOTA_EXCEEDED` | 429 | Daily AI limit per user reached; honor `Retry-After` |
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
| `CONNECTION_QUOTA_EXCEEDED` | 429 | Recruiter's 100 new Connect invitations/day reached; honor `Retry-After` |
| `CONNECTION_REINVITE_COOLDOWN` | 429 | Re-invite attempted within 24h cooldown after candidate declined; honor `Retry-After` |
| `CONNECTION_ALREADY_EXISTS` | 409 | A connection already exists for this candidate + company pair |
| `CONNECTION_INVITE_LIMIT_REACHED` | 409 | Maximum Connect invitation attempts (2) reached for this candidate + company pair |
| `NOT_ELIGIBLE_TO_CONNECT` | 422 | Candidate has no `Application` to the recruiter's company yet |
| `CONNECTION_NOT_ACCEPTED` | 422 | The connection is still `PENDING`/`DECLINED`, can't message or block yet |
| `CONNECTION_BLOCKED` | 403 | The conversation has been blocked by one side |
| `MESSAGE_BLOCKED_BY_FILTER` | 422 | Content filter matched; violation recorded, message not sent |
| `MESSAGE_EDIT_WINDOW_EXPIRED` | 422 | Message edit attempted past the 15-minute window |
| `MESSAGE_NOT_EDITABLE` | 422 | Only TEXT and LINK messages can be edited |
| `MESSAGE_ALREADY_RECALLED` | 409 | Message was already unsent for everyone |
| `CONNECTION_NOT_BLOCKED` | 409 | Unblock requested on a non-blocked conversation |
| `CONNECT_REACTION_INVALID` | 400 | Unsupported reaction emoji |
| `CONNECT_MUTED` | 403 | Temporarily restricted from sending Connect messages; honor the mute's `expiresAt` |
| `REPORT_ALREADY_REVIEWED` | 409 | The report is not `PENDING` anymore - dismiss/resolve already happened |
| `REPORT_ALREADY_FILED` | 409 | The candidate already has a `PENDING` report for this job |
| `JOB_DEADLINE_EXCEEDS_PACKAGE` | 422 | Job application deadline exceeds the active service package duration |
| `JOB_LABEL_CONFLICT` | 409 | Job already carries an active `URGENT` or `HOT` label until expiry |
| `AD_BANNER_QUANTITY_LOCKED` | 422 | Banner slot quantity tracks booked ISO weeks and cannot be mutated from cart |

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
- `GET /companies/{id}` (public) returns `PublicCompanyResource { id, name, tradingName?, address?, industry?, size?, website?, email?, phone?, description?, benefits?, logoUrl?, photoUrls, featured?, brandPageActive? }`. The profile shown is the most recently updated one, among active members, that has a description; a company with no profile only shows its registry `name` and `address`. Open jobs of a company come from `GET /jobs?companyId=`.
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
