abstract final class AppConstants {
  static const String appName = 'Intervue';

  // Network
  static const Duration connectTimeout = Duration(seconds: 15);
  static const Duration receiveTimeout = Duration(seconds: 30);
  static const Duration sendTimeout = Duration(seconds: 30);

  // Pagination
  static const int defaultPageSize = 20;

  // CV upload
  static const List<String> allowedCvExtensions = ['pdf', 'doc', 'docx'];
  static const int maxCvSizeBytes = 5 * 1024 * 1024;

  // Validation
  static final RegExp emailRegex = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');
  static const int minPasswordLength = 6;
}
