import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_request.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_response.dart';
import 'package:intervue_flutter/features/chat/domain/repositories/i_chat_repository.dart';
import 'package:intervue_flutter/features/chat/presentation/controllers/chat_cubit.dart';
import 'package:mocktail/mocktail.dart';

class MockChatRepository extends Mock implements IChatRepository {}

void main() {
  late MockChatRepository repository;
  late ChatCubit cubit;

  setUp(() {
    repository = MockChatRepository();
    cubit = ChatCubit(repository);
  });

  tearDown(() => cubit.close());

  test('khởi tạo có sẵn tin nhắn chào đón', () {
    expect(cubit.state.messages.isNotEmpty, true);
    expect(cubit.state.messages.first.isUser, false);
    expect(cubit.state.isLoading, false);
  });

  test(
    'gửi tin nhắn thành công: nhận câu trả lời và nguồn tham khảo',
    () async {
      when(
        () => repository.sendMessage(
          message: any(named: 'message'),
          sessionId: any(named: 'sessionId'),
        ),
      ).thenAnswer(
        (_) async => const ChatResponse(
          answer: 'Đây là câu trả lời của AI',
          sources: ['Tài liệu nội bộ'],
        ),
      );

      await cubit.sendMessage('Tôi muốn tối ưu CV');

      expect(cubit.state.isLoading, false);
      final lastMessage = cubit.state.messages.last;
      expect(lastMessage.isUser, false);
      expect(lastMessage.text, 'Đây là câu trả lời của AI');
      expect(lastMessage.sources, ['Tài liệu nội bộ']);
    },
  );

  test('lỗi RATE_LIMITED -> thông báo gửi quá nhanh kèm số giây chờ', () async {
    when(
      () => repository.sendMessage(
        message: any(named: 'message'),
        sessionId: any(named: 'sessionId'),
      ),
    ).thenThrow(
      const ServerException(
        'Too many requests, please try again later!',
        statusCode: 429,
        code: 'RATE_LIMITED',
        retryAfterSeconds: 30,
      ),
    );

    await cubit.sendMessage('Hỏi tiếp');

    expect(cubit.state.isLoading, false);
    final lastMessage = cubit.state.messages.last;
    expect(lastMessage.isError, true);
    expect(lastMessage.text.contains('30 seconds'), true);
    expect(lastMessage.badge, 'TOO MANY REQUESTS');
  });

  test('gửi faqCode của gợi ý FAQ tới repository', () async {
    when(
      () => repository.sendMessage(
        message: any(named: 'message'),
        sessionId: any(named: 'sessionId'),
        faqCode: any(named: 'faqCode'),
      ),
    ).thenAnswer((_) async => const ChatResponse(answer: 'FAQ answer'));

    await cubit.sendMessage(
      'How do I verify a company?',
      faqCode: 'sq-company-verification',
    );

    verify(
      () => repository.sendMessage(
        message: 'How do I verify a company?',
        sessionId: any(named: 'sessionId'),
        faqCode: 'sq-company-verification',
      ),
    ).called(1);
  });

  test('lỗi mạng -> thông báo lỗi kết nối', () async {
    when(
      () => repository.sendMessage(
        message: any(named: 'message'),
        sessionId: any(named: 'sessionId'),
      ),
    ).thenThrow(const NetworkException());

    await cubit.sendMessage('Hỏi thử');

    expect(cubit.state.isLoading, false);
    final lastMessage = cubit.state.messages.last;
    expect(lastMessage.isError, true);
    expect(lastMessage.badge, 'CONNECTION ERROR');
  });

  test('resetSession làm mới danh sách tin nhắn và tạo session mới', () {
    final oldSession = cubit.state.sessionId;
    cubit.resetSession();

    expect(cubit.state.messages.length, 1);
    expect(cubit.state.sessionId != oldSession, true);
  });

  test(
    'setChatContext lưu context và sendMessage truyền context tới repository',
    () async {
      const context = ChatContext(
        pageType: 'job_detail',
        entityId: 42,
        jobTitle: 'Senior Flutter Developer',
        companyName: 'TechX Corp',
      );

      cubit.setChatContext(context);
      expect(cubit.state.chatContext, context);

      when(
        () => repository.sendMessage(
          message: any(named: 'message'),
          sessionId: any(named: 'sessionId'),
          context: context,
        ),
      ).thenAnswer(
        (_) async => const ChatResponse(
          answer:
              'Hồ sơ của bạn phù hợp 85% với vị trí Senior Flutter Developer',
        ),
      );

      await cubit.sendMessage('So khớp CV của tôi');

      verify(
        () => repository.sendMessage(
          message: 'So khớp CV của tôi',
          sessionId: any(named: 'sessionId'),
          context: context,
        ),
      ).called(1);
      expect(cubit.state.messages.last.text, contains('85%'));
    },
  );
}
