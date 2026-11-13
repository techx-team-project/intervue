/// Per-environment configuration, loaded at build time via `--dart-define-from-file=env/<env>.json`.
class AppConfig {
  const AppConfig({required this.environment, required this.baseUrl});

  /// By default `dev` points to the Spring Boot server on the host machine
  /// (10.0.2.2 is the host address seen from the Android Emulator).
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
