import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';

import '../../helpers/fakes.dart';

void main() {
  group('ApiClient', () {
    test('bóc lớp data của response chuẩn Spring Boot', () async {
      final adapter = FakeHttpAdapter(
        (_) => jsonResponse(envelope({'id': 1, 'title': 'Flutter Dev'})),
      );
      final client = buildTestClient(adapter, storage: FakeSecureStorage());

      final data = await client.get('/api/v1/jobs/1');

      expect(data, {'id': 1, 'title': 'Flutter Dev'});
    });

    test('ném ServerException khi success=false', () async {
      final adapter = FakeHttpAdapter(
        (_) => jsonResponse({
          'success': false,
          'statusCode': 400,
          'message': 'Email đã tồn tại',
        }),
      );
      final client = buildTestClient(adapter, storage: FakeSecureStorage());

      await expectLater(
        client.get('/x'),
        throwsA(
          isA<ServerException>()
              .having((e) => e.message, 'message', 'Email đã tồn tại')
              .having((e) => e.statusCode, 'statusCode', 400),
        ),
      );
    });

    test('500 -> ServerException mang message của server', () async {
      final adapter = FakeHttpAdapter(
        (_) => jsonResponse({'message': 'Lỗi nội bộ'}, status: 500),
      );
      final client = buildTestClient(adapter, storage: FakeSecureStorage());

      await expectLater(
        client.get('/x'),
        throwsA(
          isA<ServerException>()
              .having((e) => e.message, 'message', 'Lỗi nội bộ')
              .having((e) => e.statusCode, 'statusCode', 500),
        ),
      );
    });

    test('403 -> ForbiddenException', () async {
      final adapter = FakeHttpAdapter(
        (_) => jsonResponse({'message': 'Cấm'}, status: 403),
      );
      final client = buildTestClient(adapter, storage: FakeSecureStorage());

      await expectLater(client.get('/x'), throwsA(isA<ForbiddenException>()));
    });

    test('mất kết nối -> NetworkException', () async {
      final adapter = FakeHttpAdapter(
        (o) => throw DioException(
          requestOptions: o,
          type: DioExceptionType.connectionError,
        ),
      );
      final client = buildTestClient(adapter, storage: FakeSecureStorage());

      await expectLater(client.get('/x'), throwsA(isA<NetworkException>()));
    });

    test('đính kèm Bearer token, trừ request skipAuth', () async {
      final adapter = FakeHttpAdapter((_) => jsonResponse(envelope(null)));
      final client = buildTestClient(
        adapter,
        storage: FakeSecureStorage(access: 'abc'),
      );

      await client.get('/private');
      await client.post('/api/v1/auth/login', skipAuth: true);

      expect(adapter.requests[0].authorization, 'Bearer abc');
      expect(adapter.requests[1].authorization, isNull);
    });
  });
}
