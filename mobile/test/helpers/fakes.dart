import 'dart:convert';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:intervue_flutter/core/config/app_config.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/core/network/session_expired_notifier.dart';
import 'package:intervue_flutter/core/storage/secure_storage.dart';

class FakeSecureStorage implements SecureStorage {
  FakeSecureStorage({this.access, this.refresh});

  String? access;
  String? refresh;

  @override
  Future<String?> getAccessToken() async => access;

  @override
  Future<String?> getRefreshToken() async => refresh;

  @override
  Future<void> saveTokens({
    required String accessToken,
    String? refreshToken,
  }) async {
    access = accessToken;
    if (refreshToken != null) refresh = refreshToken;
  }

  @override
  Future<void> clearTokens() async {
    access = null;
    refresh = null;
  }
}

class RecordedRequest {
  RecordedRequest(this.path, this.headers);

  final String path;
  final Map<String, dynamic> headers;

  String? get authorization => headers['Authorization'] as String?;
}

class FakeHttpAdapter implements HttpClientAdapter {
  FakeHttpAdapter(this._handler);

  final ResponseBody Function(RequestOptions options) _handler;
  final List<RecordedRequest> requests = [];

  int count(String path) => requests.where((r) => r.path == path).length;

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    requests.add(RecordedRequest(options.path, Map.of(options.headers)));
    return _handler(options);
  }

  @override
  void close({bool force = false}) {}
}

ResponseBody jsonResponse(
  Object body, {
  int status = 200,
  Map<String, List<String>> headers = const {},
}) => ResponseBody.fromString(
  jsonEncode(body),
  status,
  headers: {
    Headers.contentTypeHeader: [Headers.jsonContentType],
    ...headers,
  },
);

/// Response chuẩn của Spring Boot.
Map<String, dynamic> envelope(Object? data, {int status = 200}) => {
  'success': true,
  'statusCode': status,
  'message': 'Success',
  'data': data,
};

ApiClient buildTestClient(
  FakeHttpAdapter adapter, {
  required FakeSecureStorage storage,
  SessionExpiredNotifier? notifier,
}) => ApiClient.create(
  config: const AppConfig(environment: 'test', baseUrl: 'http://test.local'),
  storage: storage,
  sessionExpiredNotifier: notifier ?? SessionExpiredNotifier(),
  httpClientAdapter: adapter,
);
