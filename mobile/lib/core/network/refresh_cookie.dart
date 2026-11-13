import 'package:dio/dio.dart';

/// The backend keeps the refresh token in an HttpOnly cookie; mobile has no cookie jar,
/// so it reads `Set-Cookie` itself and sends it back via the `Cookie` header.
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
