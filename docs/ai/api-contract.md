# API Contract (Backend ⇄ Frontend)

Single source of truth for the HTTP contract. Update this file in the **same PR** that changes an endpoint.
Until OpenAPI (springdoc) is adopted, list endpoints here.

## Envelope

```ts
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T | null;
  error: { code: string; details?: string; fieldErrors?: { field: string; message: string }[] } | null;
  traceId: string;
  timestamp: string; // ISO-8601 UTC
};
type Page<T> = { items: T[]; page: number; size: number; totalItems: number; totalPages: number };
```

- Base URL: `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:8080/api/v1`).
- Auth: `Authorization: Bearer <accessToken>`; refresh token is an HttpOnly cookie → frontend requests use `credentials: 'include'`.
- Frontend branches on `error.code`, never on `message`.

## Endpoints

| Status | Method & path | Auth | Request | Response `data` |
|---|---|---|---|---|
| ✅ | `POST /auth/register` | public | `RegisterRequest` | `{ accessToken, user }` + refresh cookie |
| ⬜ | `POST /auth/login` | public | `{ email, password }` | `{ accessToken, user }` + cookie |
| ⬜ | `POST /auth/refresh` | cookie | – | `{ accessToken }` (rotates cookie) |
| ⬜ | `POST /auth/logout` | user | – | – |
| ⬜ | `GET /users/me` | user | – | `UserResource` |

Add rows as endpoints are built. Keep ✅ = implemented, ⬜ = planned.

## Error codes

| Code | HTTP | Meaning |
|---|---|---|
| `VALIDATION_FAILED` | 400 | See `fieldErrors` |
| `UNAUTHENTICATED` | 401 | Missing/expired token → frontend tries refresh once |
| `FORBIDDEN` | 403 | Role/ownership failure |
| `NOT_FOUND` | 404 | |
| `EMAIL_ALREADY_USED` | 409 | |
| `IDENTITY_NOT_VERIFIED` | 422 | Candidate must complete eKYC to apply |
| `COMPANY_NOT_VERIFIED` | 422 | Company must be verified to post |
| `RATE_LIMITED` | 429 | Honor `Retry-After` |
