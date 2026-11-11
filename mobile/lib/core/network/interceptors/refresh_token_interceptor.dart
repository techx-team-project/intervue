import 'package:dio/dio.dart';
import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/network/refresh_cookie.dart';
import 'package:intervue_flutter/core/network/request_flags.dart';
import 'package:intervue_flutter/core/network/session_expired_notifier.dart';
import 'package:intervue_flutter/core/storage/secure_storage.dart';

/// Khi gặp `401`: gọi `/auth/refresh` (refresh token gửi qua cookie), lưu token mới rồi gọi lại request lỗi.
///
/// Dùng [QueuedInterceptor] nên các request 401 đồng thời được xử lý lần lượt:
/// chỉ request đầu tiên refresh, các request sau thấy token đã đổi và retry luôn.
/// [bareDio] là Dio không gắn interceptor — dùng cho refresh và retry để không
/// bị khoá chờ chính hàng đợi của interceptor này.
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
    // FormData chỉ được gửi một lần, phải clone trước khi gửi lại.
    if (data is FormData) request.data = data.clone();
    return _bareDio.fetch<dynamic>(request);
  }
}
