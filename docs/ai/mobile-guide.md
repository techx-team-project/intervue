# Mobile Guide (Flutter)

Audience: developers and AI agents working in `mobile/`.

## 1. Architecture & folder layout

`mobile/` uses **Feature-First + Pragmatic Clean Architecture**:
- Simple CRUD features use 2 layers: `data/` (`datasources`, `models`, `repositories`) + `presentation/` (`controllers`, `views`, `widgets`).
- Complex domain features (e.g. `job`, `chat`) add a `domain/` layer (`entities`, `repositories` interface).

```text
mobile/
├─ lib/
│  ├─ app/                    App root, BlocObserver, GoRouter + auth guard
│  ├─ core/
│  │  ├─ config/              AppConfig (--dart-define from env/*.json)
│  │  ├─ constants/           ApiEndpoints, AppConstants
│  │  ├─ di/                  GetIt registrations (injection_container.dart)
│  │  ├─ errors/              AppException + Failure mapping
│  │  ├─ network/             ApiClient (Dio), AuthInterceptor, RefreshTokenInterceptor
│  │  ├─ storage/             SecureStorage (flutter_secure_storage)
│  │  ├─ theme/               AppColors, AppTheme, LiquidGlassTheme
│  │  ├─ utils/               Formatters, FileHelpers
│  │  └─ widgets/             Shared reusable widgets
│  ├─ features/
│  │  ├─ application/         Candidate applications list & apply modal
│  │  ├─ auth/                Splash, Login (+ 2FA challenge), Register, AuthBloc
│  │  ├─ blog/                Career guide & blog list/detail
│  │  ├─ chat/                InterVue AI chatbot
│  │  ├─ company/             Company detail bottom sheet
│  │  ├─ cover_letter/        AI cover letter generator
│  │  ├─ job/                 Public job feed, filters, job detail, home tabs
│  │  ├─ job_alert/           Candidate job alert subscriptions
│  │  ├─ notification/        In-app notification list & unread badge
│  │  ├─ profile/             Candidate profile (experiences, skills, education, ...)
│  │  ├─ resume/              Candidate CV upload/manage & AI CV review
│  │  ├─ security/            Password change & 2FA setup/disable
│  │  └─ upgrade/             Plan overview UI
│  └─ main.dart
├─ env/                       dev.json (10.0.2.2:8080), staging.json, prod.json
└─ test/                      Unit & widget tests mirroring lib/
```

## 2. Networking, Auth & Envelope

- Backend `ApiResource<T>` (`{ success, statusCode, message, data }`) is unwrapped centrally in `ApiClient` (`lib/core/network/api_client.dart`).
- `AuthInterceptor` injects `Authorization: Bearer <accessToken>` unless `skipAuth: true`.
- `RefreshTokenInterceptor` (`QueuedInterceptor`) intercepts `401` once, exchanges the stored `refreshToken` via `Cookie: refresh_token=...` against `POST /api/v1/auth/refresh`, rotates stored tokens, and retries queued requests. If refresh fails, it clears tokens and notifies `SessionExpiredNotifier` -> `AuthBloc`.
- **Startup rule:** `AuthRepositoryImpl.hasSession()` verifies a non-empty local token against `GET /api/v1/users/me` so stale tokens after local DB resets are cleared before protected tab cubits fire.
- **Guest safety:** Cubits tied to protected candidate APIs (`ProfileCubit`, `CandidateProfileCubit`, `NotificationsCubit`, `CandidateCvCubit`) must listen to `AuthBloc` and never call protected endpoints while `AuthUnauthenticated`.
- **2FA login flow:** `LoginResponse` / `AuthResponse` supports nullable `accessToken`, `requiresTwoFactor`, and `tempToken`; when `requiresTwoFactor == true`, `LoginCubit` emits `LoginRequiresTwoFactor` and verifies OTP/backup codes via `POST /api/v1/auth/verify-2fa`.

## 3. Codegen & Serialization

- Models use `@freezed` + `json_serializable` (`build.yaml` sets `field_rename: snake` and `explicit_to_json: true`; note auth fields using camelCase in backend DTOs declare explicit `@JsonKey(name: ...)`).
- After changing any `@freezed` or `@JsonSerializable()` class, run:

```bash
cd mobile && dart run build_runner build --delete-conflicting-outputs
```

## 4. UI & Conventions

- Vietnamese for all user-facing strings; English for identifiers, routes (`RouteNames`), and commit messages.
- Follow root `AGENTS.md` / `CLAUDE.md` rules on comments (no comments by default; max one short single-line English comment for genuinely non-obvious logic) and tests (update affected tests when changing contracts; no unsolicited test suites).
- Verify any new endpoint against Spring Boot controllers and `docs/ai/api-contract.md` before wiring; never call recruiter/admin routes (`/api/v1/recruiter/**`, `/api/v1/admin/**`) from candidate screens.

## 5. Verification

```bash
cd mobile
flutter pub get
dart format --output=none --set-exit-if-changed lib test
flutter analyze
flutter test
flutter build apk --debug --dart-define-from-file=env/dev.json
```

