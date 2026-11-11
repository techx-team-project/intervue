import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:intervue_flutter/core/config/app_config.dart';
import 'package:intervue_flutter/core/constants/app_constants.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/interceptors/auth_interceptor.dart';
import 'package:intervue_flutter/core/network/interceptors/refresh_token_interceptor.dart';
import 'package:intervue_flutter/core/network/request_flags.dart';
import 'package:intervue_flutter/core/network/session_expired_notifier.dart';
import 'package:intervue_flutter/core/storage/secure_storage.dart';

class ApiClient {
  ApiClient(this._dio);

  factory ApiClient.create({
    required AppConfig config,
    required SecureStorage storage,
    required SessionExpiredNotifier sessionExpiredNotifier,
    @visibleForTesting HttpClientAdapter? httpClientAdapter,
  }) {
    final options = BaseOptions(
      baseUrl: config.baseUrl,
      connectTimeout: AppConstants.connectTimeout,
      receiveTimeout: AppConstants.receiveTimeout,
      sendTimeout: AppConstants.sendTimeout,
      headers: const {'Accept': 'application/json'},
    );
    final dio = Dio(options);
    final bareDio = Dio(options);
    if (httpClientAdapter != null) {
      dio.httpClientAdapter = httpClientAdapter;
      bareDio.httpClientAdapter = httpClientAdapter;
    }

    dio.interceptors.addAll([
      AuthInterceptor(storage),
      RefreshTokenInterceptor(
        bareDio: bareDio,
        storage: storage,
        sessionExpiredNotifier: sessionExpiredNotifier,
      ),
      if (kDebugMode) LogInterceptor(requestHeader: false, responseBody: false),
    ]);
    return ApiClient(dio);
  }

  final Dio _dio;

  Future<dynamic> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    bool skipAuth = false,
  }) =>
      _send('GET', path, queryParameters: queryParameters, skipAuth: skipAuth);

  Future<dynamic> post(
    String path, {
    Object? data,
    Map<String, dynamic>? queryParameters,
    bool skipAuth = false,
    Duration? receiveTimeout,
    Map<String, dynamic>? headers,
  }) async => _unwrap(
    await _request(
      'POST',
      path,
      data: data,
      queryParameters: queryParameters,
      skipAuth: skipAuth,
      receiveTimeout: receiveTimeout,
      headers: headers,
    ),
  );

  /// Như [post] nhưng trả thêm response headers (cần để đọc cookie `Set-Cookie`).
  Future<({dynamic data, Headers headers})> postWithHeaders(
    String path, {
    Object? data,
    bool skipAuth = false,
    Map<String, dynamic>? headers,
  }) async {
    final response = await _request(
      'POST',
      path,
      data: data,
      skipAuth: skipAuth,
      headers: headers,
    );
    return (data: _unwrap(response), headers: response.headers);
  }

  Future<dynamic> put(String path, {Object? data}) =>
      _send('PUT', path, data: data);

  Future<dynamic> patch(String path, {Object? data}) =>
      _send('PATCH', path, data: data);

  Future<dynamic> delete(String path) => _send('DELETE', path);

  Future<dynamic> _send(
    String method,
    String path, {
    Object? data,
    Map<String, dynamic>? queryParameters,
    bool skipAuth = false,
  }) async => _unwrap(
    await _request(
      method,
      path,
      data: data,
      queryParameters: queryParameters,
      skipAuth: skipAuth,
    ),
  );

  Future<Response<dynamic>> _request(
    String method,
    String path, {
    Object? data,
    Map<String, dynamic>? queryParameters,
    bool skipAuth = false,
    Duration? receiveTimeout,
    Map<String, dynamic>? headers,
  }) async {
    try {
      return await _dio.request<dynamic>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: Options(
          method: method,
          receiveTimeout: receiveTimeout,
          headers: headers,
          extra: {if (skipAuth) RequestFlags.skipAuth: true},
        ),
      );
    } on DioException catch (e) {
      throw AppException.fromDioException(e);
    }
  }

  dynamic _unwrap(Response<dynamic> response) {
    final body = response.data;
    if (body is Map<String, dynamic> && body.containsKey('success')) {
      if (body['success'] != true) {
        throw ServerException(
          body['message']?.toString() ?? 'Yêu cầu không thành công',
          statusCode:
              (body['statusCode'] as num?)?.toInt() ?? response.statusCode,
        );
      }
      return body['data'];
    }
    return body;
  }
}
