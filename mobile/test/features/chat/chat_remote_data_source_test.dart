import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/chat/data/datasources/chat_remote_data_source.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_request.dart';

import '../../helpers/fakes.dart';

void main() {
  ChatRemoteDataSource buildDataSource(FakeHttpAdapter adapter) =>
      ChatRemoteDataSource(
        buildTestClient(adapter, storage: FakeSecureStorage()),
      );

  test('gửi câu hỏi và bóc tách ChatResponse thành công', () async {
    final adapter = FakeHttpAdapter((options) {
      expect(options.path, '/api/v1/ai/chat');
      expect(options.method, 'POST');
      return jsonResponse(
        envelope({
          'answer': 'Xin chào, tôi là trợ lý AI!',
          'sources': ['Source A', 'Source B'],
          'remainingQuota': 29,
        }),
      );
    });

    final res = await buildDataSource(
      adapter,
    ).sendMessage(const ChatRequest(message: 'Chào bạn', sessionId: 's-123'));

    expect(res.answer, 'Xin chào, tôi là trợ lý AI!');
    expect(res.sources, ['Source A', 'Source B']);
    expect(res.remainingQuota, 29);
  });

  test('data trả về không phải Map -> ném ServerException', () async {
    final adapter = FakeHttpAdapter((_) => jsonResponse(envelope('invalid')));

    await expectLater(
      buildDataSource(adapter).sendMessage(const ChatRequest(message: 'Hi')),
      throwsA(isA<ServerException>()),
    );
  });
}
