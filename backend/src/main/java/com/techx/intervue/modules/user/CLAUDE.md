# Module: user (accounts, roles, auth, sessions)

Loaded only when working inside `modules/user`. This is the **reference module** — copy its structure for new modules.

## Contents

- Entities: `User`, `Role`, `UserRole` (many-to-many, a user can be Candidate + Recruiter), `RefreshToken`. Enum `RoleType`.
- Services (`services/impl`): `UserService`, `JwtService`, `RefreshTokenService`, `UserSessionCache` (Redis). Interfaces in `services/interfaces`.
- Controller: `AuthController` → `/api/v1/auth/*`.

## Security-critical rules

- **Refresh token:** random opaque value, stored **hashed** (`TokenHashUtil`), sent only as an HttpOnly + Secure + SameSite cookie (`CookieHelper`). Rotate on every use; reuse of an old token revokes the whole family.
- **Access token:** JWT, 15 min, minimal claims (`sub`, `roles`, `jti`, `iss=InterVue`). On logout put `jti` in the Redis blacklist (`BlacklistServiceInterface`) until expiry.
- Passwords: BCrypt only. Never log passwords, tokens or reset links.
- Registration/login/reset/resend endpoints must be rate-limited (Bucket4j) and return identical messages for unknown email vs. wrong password.
- Role or ban changes must evict `UserSessionCache` for that user.
- Never read the user id from a request body; take it from the authenticated principal (`CustomUserDetails`).

## Known gaps (fix when touching)

- `AuthController` injects `UserService` (impl) → inject `UserServiceInterface`.
- Only `register` exists; `login`, `refresh`, `logout`, `me` are planned (see `docs/ai/api-contract.md`).
- No `GlobalExceptionHandler` yet; add one with `AppException` + `ErrorCode`.
- Other modules (`candidate`, `company`, `job`, `application`) must not import `user` repositories/entities; use `UserServiceInterface`.
