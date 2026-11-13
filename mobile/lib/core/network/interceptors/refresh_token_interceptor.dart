import 'package:dio/dio.dart';
import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/network/refresh_cookie.dart';
import 'package:intervue_flutter/core/network/request_flags.dart';
import 'package:intervue_flutter/core/network/session_expired_notifier.dart';
import 'package:intervue_flutter/core/storage/secure_storage.dart';

/// On `401`: calls `/auth/refresh` (refresh token sent via cookie), stores the new token and retries the failed request.
///
/// Uses [QueuedInterceptor], so concurrent 401 requests are handled one by one:
/// only the first request refreshes; the rest see the rotated token and retry directly.
/// [bareDio] is a Dio without interceptors, used for refresh and retry so it does not
/// block on this interceptor's own queue.
class RefreshTokenInterceptor extends QueuedInterceptor {
  RefreshTokenInterceptor({
    required this._bareDio,
    required this._storage,
    required SessionExpiredNotifier sessionExpiredNotifier,
  }) : _notifier = sessionExpiredNotifier;

  final Dio _bareDio;
  final SecureStorage _storage;
  final SessionExpiredNotifier _notifier;

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final request = err.requestOptions;
    final shouldRefresh =
        err.response?.statusCode == 401 &&
        request.extra[RequestFlags.skipAuth] != true &&
        request.extra[RequestFlags.retried] != true;
    if (!shouldRefresh) return handler.next(err);

    final currentToken = await _storage.getAccessToken();
    final tokenAlreadyRotated =
        currentToken != null &&
        request.headers['Authorization'] != 'Bearer $currentToken';

    final token = tokenAlreadyRotated ? currentToken : await _refreshToken();
    if (token == null) {
      await _storage.clearTokens();
      _notifier.notify();
      return handler.next(err);
    }

    try {
      handler.resolve(await _retry(request, token));
    } on DioException catch (e) {
      handler.next(e);
    }
  }

  Future<String?> _refreshToken() async {
    final refreshToken = await _storage.getRefreshToken();
    if (refreshToken == null) return null;
    try {
      final response = await _bareDio.post<dynamic>(
        ApiEndpoints.refreshToken,
        options: Options(
          headers: RefreshCookie.header(refreshToken),
          extra: {RequestFlags.skipAuth: true},
        ),
      );
      final body = response.data;
      final data = body is Map<String, dynamic> ? body['data'] ?? body : null;
      if (data is! Map<String, dynamic>) return null;
      final access = data['accessToken'];
      if (access is! String || access.isEmpty) return null;
      await _storage.saveTokens(
        accessToken: access,
        refreshToken: RefreshCookie.parse(response.headers),
      );
      return access;
    } on DioException {
      return null;
    }
  }

  Future<Response<dynamic>> _retry(RequestOptions request, String token) {
    request.headers['Authorization'] = 'Bearer $token';
    request.extra[RequestFlags.retried] = true;
    final data = request.data;
    // FormData can only be sent once, so it must be cloned before retrying.
    if (data is FormData) request.data = data.clone();
    return _bareDio.fetch<dynamic>(request);
  }
}
