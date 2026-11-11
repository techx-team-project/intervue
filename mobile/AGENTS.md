# InterVue Mobile — Agent Guide

Stack: Flutter · Dart `^3.13.2` · `flutter_bloc` (BLoC/Cubit) · `go_router` · `dio` · `get_it` · `freezed` + `json_serializable` · `flutter_secure_storage`.
Full guide: **`../docs/ai/mobile-guide.md`**. API contract: `../docs/ai/api-contract.md`. Monorepo rules: `../AGENTS.md`.

## Golden rules

1. **Architecture:** Feature-First + Pragmatic Clean Architecture (`data/` + `presentation/`, plus `domain/` when business logic needs entity/repository abstraction).
2. **DI & Routing:** Register dependencies in `lib/core/di/injection_container.dart`; define route paths in `lib/app/routes/route_names.dart` and `AppRouter` (`lib/app/routes/app_router.dart`).
3. **Single HTTP client:** All requests go through `ApiClient` (`lib/core/network/api_client.dart`) using constants in `lib/core/constants/api_endpoints.dart`.
4. **Auth & Guest safety:** Protected feature cubits must guard against unauthenticated state via `AuthBloc` and handle loading, empty, and error states cleanly.
5. **Backend alignment:** Only call Candidate/Public Spring Boot endpoints verified in backend controllers; never auto-trigger paid/credit-charging AI endpoints on screen open without explicit user action.
6. **Codegen:** Re-run `dart run build_runner build --delete-conflicting-outputs` whenever modifying `@freezed` or `@JsonSerializable` models.
7. **Style:** English for code/commits; Vietnamese for UI copy. Run `dart format .`, `flutter analyze`, and `flutter test` before reporting done.

## Commands

```bash
flutter pub get
flutter run --dart-define-from-file=env/dev.json
dart run build_runner build --delete-conflicting-outputs
dart format .
flutter analyze
flutter test
```

