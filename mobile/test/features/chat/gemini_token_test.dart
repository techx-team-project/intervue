import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/chat/data/datasources/chat_remote_data_source.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_request.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_response.dart';
import 'package:intervue_flutter/features/chat/presentation/controllers/chat_cubit.dart';
import 'package:mocktail/mocktail.dart';

import '../../helpers/fakes.dart';
import 'chat_cubit_test.dart';

void main() {
  group('Kiểm thử tích hợp Gemini Gateway và xử lý lỗi AI', () {
    test(
      'ChatRemoteDataSource xử lý chuẩn payload phản hồi từ Gemini Gateway',
      () async {
        final adapter = FakeHttpAdapter((options) {
          expect(options.path, '/api/v1/ai/chat');
          expect(options.method, 'POST');
          expect(options.receiveTimeout, const Duration(seconds: 60));

          return jsonResponse(
            envelope({
              'answer': '**InterVue AI** đã phân tích CV của bạn: Điểm ATS ước tính 85/100.',
              'sources': [
                'recruiter_flows.md',
                'support_faq.md (ATS Guidelines)',
              ],
            }),
          );
        });

        final dataSource = ChatRemoteDataSource(
          buildTestClient(adapter, storage: FakeSecureStorage()),
        );

        final response = await dataSource.sendMessage(
          const ChatRequest(
            message: 'Chấm điểm CV của tôi',
            sessionId: 'session_test_token',
          ),
        );

        expect(response.answer, contains('85/100'));
        expect(response.sources.length, 2);
      },
    );

    test('ChatResponse chịu lỗi tốt khi thiếu trường sources', () {
      final parsed = ChatResponse.fromJson({
        'answer': 'Câu trả lời từ Gemini',
        'sources': null,
      });
      expect(parsed.answer, 'Câu trả lời từ Gemini');
      expect(parsed.sources, isEmpty);
    });

    test(
      'Xử lý lỗi AI_PROVIDER_BUSY (503 Service Unavailable) từ Gemini',
      () async {
        final repository = MockChatRepository();
        final cubit = ChatCubit(repository);

        when(
          () => repository.sendMessage(
            message: any(named: 'message'),
            sessionId: any(named: 'sessionId'),
          ),
        ).thenThrow(
          const ServerException(
            'The AI service is busy, please try again later!',
            statusCode: 503,
            code: 'AI_PROVIDER_BUSY',
          ),
        );

        await cubit.sendMessage('Tư vấn mức lương');

        expect(cubit.state.isLoading, false);
        final lastMessage = cubit.state.messages.last;
        expect(lastMessage.isError, true);
        expect(lastMessage.badge, 'AI BUSY');
        expect(
          lastMessage.actions?.any((a) => a.label.contains('Retry')),
          true,
        );
        expect(lastMessage.actions?.first.query, 'Tư vấn mức lương');

        await cubit.close();
      },
    );
  });
}
