# InterVue — Mobile App (Flutter)

Ứng dụng di động dành cho ứng viên của nền tảng **InterVue**, kết nối trực tiếp tới backend Spring Boot (`backend/`).

Kiến trúc: **Feature-First + Pragmatic Clean Architecture** (CRUD 2 tầng `data` + `presentation`; nghiệp vụ phức tạp 3 tầng thêm `domain`), quản lý state bằng **BLoC / Cubit**, điều hướng bằng **GoRouter**, DI bằng **GetIt**.

## Chạy ứng dụng

```bash
cd mobile
flutter pub get
flutter run --dart-define-from-file=env/dev.json
```

Cấu hình môi trường nằm trong `env/`:
- `env/dev.json`: trỏ tới `http://10.0.2.2:8080` (dùng trên Android Emulator trỏ về backend local).
- `env/staging.json`, `env/prod.json`: cập nhật `BASE_URL` thực tế trước khi build release.

Build APK debug:

```bash
flutter build apk --dart-define-from-file=env/dev.json
```

## Sinh code (`freezed` / `json_serializable`)

```bash
dart run build_runner build --delete-conflicting-outputs
```

## Cấu trúc thư mục

```text
lib/
├── app/         App root, BlocObserver, GoRouter (auth guard)
├── core/        config, constants, di, errors, network (Dio), storage, theme, utils, widgets
├── features/
│   ├── application/   Ứng tuyển & theo dõi hồ sơ đã nộp
│   ├── auth/          Splash, Đăng nhập (gồm 2FA), Đăng ký, AuthBloc
│   ├── blog/          Cẩm nang nghề nghiệp & bài viết
│   ├── chat/          Chatbot tư vấn InterVue AI
│   ├── company/       Chi tiết công ty
│   ├── cover_letter/  Tạo thư xin việc bằng AI
│   ├── job/           Trang chủ, tìm kiếm, lọc và chi tiết việc làm
│   ├── job_alert/     Quản lý thông báo việc làm phù hợp
│   ├── notification/  Thông báo in-app
│   ├── profile/       Hồ sơ ứng viên (kinh nghiệm, học vấn, kỹ năng...)
│   ├── resume/        Quản lý CV & AI chấm điểm CV
│   ├── security/      Đổi mật khẩu & xác thực 2 lớp (2FA)
│   └── upgrade/       Giới thiệu gói dịch vụ
└── main.dart
```

## Kiểm tra chất lượng

```bash
dart format --output=none --set-exit-if-changed lib test
flutter analyze
flutter test
```
