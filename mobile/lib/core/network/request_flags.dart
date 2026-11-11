/// Khoá trong `RequestOptions.extra` để điều khiển interceptor.
abstract final class RequestFlags {
  /// Request công khai: không đính kèm Bearer token, không refresh khi 401.
  static const String skipAuth = 'skipAuth';

  /// Request đã được retry sau khi refresh token, tránh lặp vô hạn.
  static const String retried = 'retried';
}
