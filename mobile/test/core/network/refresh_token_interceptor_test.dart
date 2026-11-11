import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/session_expired_notifier.dart';

import '../../helpers/fakes.dart';

void main() {
  const refreshPath = ApiEndpoints.refreshToken;

  ResponseBody refreshSuccess() => jsonResponse(
    envelope({'accessToken': 'new-access'}),
    headers: {
      'set-cookie': [
        'refresh_token=new-refresh; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Strict',
      ],
    },
  );

  test('401 -> refresh token -> gọi lại request với token mới', () async {
    final storage = FakeSecureStorage(access: 'old', refresh: 'r1');
    final adapter = FakeHttpAdapter((o) {
      if (o.path == refreshPath) return refreshSuccess();
      if (o.headers['Authorization'] == 'Bearer new-access') {
        return jsonResponse(envelope({'ok': true}));
      }
      return jsonResponse({'message': 'expired'}, status: 401);
    });
    final client = buildTestClient(adapter, storage: storage);

    final data = await client.get('/api/v1/jobs');

    expect(data, {'ok': true});
    expect(storage.access, 'new-access');
    expect(storage.refresh, 'new-refresh');
    expect(adapter.count('/api/v1/jobs'), 2);
    expect(adapter.count(refreshPath), 1);
  });

  test('nhiều request 401 đồng thời chỉ refresh một lần', () async {
    final storage = FakeSecureStorage(access: 'old', refresh: 'r1');
    final adapter = FakeHttpAdapter((o) {
      if (o.path == refreshPath) return refreshSuccess();
      if (o.headers['Authorization'] == 'Bearer new-access') {
        return jsonResponse(envelope(o.path));
      }
      return jsonResponse({'message': 'expired'}, status: 401);
    });
    final client = buildTestClient(adapter, storage: storage);

    final results = await Future.wait([client.get('/a'), client.get('/b')]);

    expect(results, ['/a', '/b']);
    expect(adapter.count(refreshPath), 1);
  });

  test(
    'refresh thất bại -> xoá token, báo phiên hết hạn, ném Unauthorized',
    () async {
      final storage = FakeSecureStorage(access: 'old', refresh: 'r1');
      final notifier = SessionExpiredNotifier();
      final expired = notifier.stream.first;
      final adapter = FakeHttpAdapter((o) {
        if (o.path == refreshPath) {
          return jsonResponse({'message': 'invalid'}, status: 401);
        }
        return jsonResponse({'message': 'expired'}, status: 401);
      });
      final client = buildTestClient(
        adapter,
        storage: storage,
        notifier: notifier,
      );

      await expectLater(
        client.get('/x'),
        throwsA(isA<UnauthorizedException>()),
      );

      await expired.timeout(const Duration(seconds: 1));
      expect(storage.access, isNull);
      expect(storage.refresh, isNull);
    },
  );

  test(
    'không có refresh token -> báo phiên hết hạn, không gọi refresh',
    () async {
      final storage = FakeSecureStorage(access: 'old');
      final adapter = FakeHttpAdapter(
        (_) => jsonResponse({'message': 'expired'}, status: 401),
      );
      final client = buildTestClient(adapter, storage: storage);

      await expectLater(
        client.get('/x'),
        throwsA(isA<UnauthorizedException>()),
      );

      expect(adapter.count(refreshPath), 0);
    },
  );

  test('request skipAuth bị 401 thì không refresh', () async {
    final storage = FakeSecureStorage(access: 'old', refresh: 'r1');
    final adapter = FakeHttpAdapter(
      (_) => jsonResponse({'message': 'Sai mật khẩu'}, status: 401),
    );
    final client = buildTestClient(adapter, storage: storage);

    await expectLater(
      client.post(ApiEndpoints.login, skipAuth: true),
      throwsA(
        isA<UnauthorizedException>().having(
          (e) => e.message,
          'message',
          'Sai mật khẩu',
        ),
      ),
    );

    expect(adapter.count(refreshPath), 0);
    expect(storage.access, 'old');
  });

  test('request retry vẫn 401 thì dừng, không lặp vô hạn', () async {
    final storage = FakeSecureStorage(access: 'old', refresh: 'r1');
    final adapter = FakeHttpAdapter((o) {
      if (o.path == refreshPath) return refreshSuccess();
      return jsonResponse({'message': 'forbidden-ish'}, status: 401);
    });
    final client = buildTestClient(adapter, storage: storage);

    await expectLater(client.get('/x'), throwsA(isA<UnauthorizedException>()));

    expect(adapter.count('/x'), 2);
    expect(adapter.count(refreshPath), 1);
  });
}
