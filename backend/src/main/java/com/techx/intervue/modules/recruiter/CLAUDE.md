# Module: recruiter (recruiter accounts, auth, sessions)

Recruiters are a separate account type from candidates/admins: table `recruiters`, own `recruiter_refresh_tokens`, own cookie `recruiter_refresh_token`, own Redis session `recruiter:session:{id}`. The same email may exist in `users` and `recruiters`; there is no upgrade path.

## Contents

- Entities `Recruiter`, `RecruiterRefreshToken`; enum `RecruiterStatus`.
- `RecruiterAuthService` (register, login, refresh, logout), `RecruiterRefreshTokenService`, `RecruiterSessionCache`, `RecruiterService` (me).
- Controllers: `RecruiterAuthController` (`/api/v1/recruiter/auth/*`), `RecruiterController` (`/api/v1/recruiter/me`).

## Rules

- Access tokens carry `typ=RECRUITER` (`AccountType`); `JwtAuthFilter` grants `ROLE_RECRUITER` from it. Recruiter tokens are rejected outside `/api/v1/recruiter/**`.
- Never mix ids: a recruiter id is not a `users.id`.
- Other modules reach recruiters only through `RecruiterServiceInterface`.

## TODO for the next developer

- Email verification, forgot/reset password, phone verification, 2FA, account deletion.
- Move `company_members` and other recruiter-owned company columns from `users.id` to `recruiters.id`.
- Admin management of recruiters (list, suspend, restore); local seed recruiter account.
