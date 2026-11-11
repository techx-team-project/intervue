/// Cấu hình theo môi trường, nạp lúc build qua `--dart-define-from-file=env/<env>.json`.
class AppConfig {
  const AppConfig({required this.environment, required this.baseUrl});

  /// Mặc định `dev` trỏ tới Spring Boot chạy trên máy host
  /// (10.0.2.2 là địa chỉ của máy host từ Android Emulator).
  factory AppConfig.fromEnvironment() => const AppConfig(
    environment: String.fromEnvironment('ENV', defaultValue: 'dev'),
    baseUrl: String.fromEnvironment(
      'BASE_URL',
      defaultValue: 'http://10.0.2.2:8080',
    ),
  );

  final String environment;
  final String baseUrl;

  bool get isProd => environment == 'prod';
}
