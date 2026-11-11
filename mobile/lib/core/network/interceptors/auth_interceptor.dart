import 'package:dio/dio.dart';
import 'package:intervue_flutter/core/network/request_flags.dart';
import 'package:intervue_flutter/core/storage/secure_storage.dart';

/// Đính kèm `Authorization: Bearer <access_token>` vào mọi request.
class AuthInterceptor extends Interceptor {
  AuthInterceptor(this._storage);

  final SecureStorage _storage;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    if (options.extra[RequestFlags.skipAuth] != true) {
      final token = await _storage.getAccessToken();
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    }
    handler.next(options);
  }
}
