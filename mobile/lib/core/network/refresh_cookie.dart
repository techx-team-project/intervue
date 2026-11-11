import 'package:dio/dio.dart';

/// Backend giữ refresh token trong cookie HttpOnly; mobile không có cookie jar
/// nên tự đọc `Set-Cookie` và gửi lại qua header `Cookie`.
abstract final class RefreshCookie {
  static const String name = 'refresh_token';

  static String? parse(Headers headers) {
    final cookies = headers['set-cookie'];
    if (cookies == null) return null;
    for (final cookie in cookies) {
      final pair = cookie.split(';').first.trim();
      if (pair.startsWith('$name=')) {
        final value = pair.substring(name.length + 1);
        return value.isEmpty ? null : value;
      }
    }
    return null;
  }

  static Map<String, dynamic> header(String token) => {
    'Cookie': '$name=$token',
  };
}
