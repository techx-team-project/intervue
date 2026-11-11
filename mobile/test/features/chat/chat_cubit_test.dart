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

  test('gửi tin nhắn thành công: nhận câu trả lời và hạn mức', () async {
    when(
      () => repository.sendMessage(
        message: any(named: 'message'),
        sessionId: any(named: 'sessionId'),
      ),
    ).thenAnswer(
      (_) async => const ChatResponse(
        answer: 'Đây là câu trả lời của AI',
        sources: ['Tài liệu nội bộ'],
        remainingQuota: 15,
      ),
    );

    await cubit.sendMessage('Tôi muốn tối ưu CV');

    expect(cubit.state.isLoading, false);
    expect(cubit.state.remainingQuota, 15);
    final lastMessage = cubit.state.messages.last;
    expect(lastMessage.isUser, false);
    expect(lastMessage.text, 'Đây là câu trả lời của AI');
    expect(lastMessage.sources, ['Tài liệu nội bộ']);
  });

  test('lỗi hết hạn mức (quota) -> hiển thị thông báo nâng cấp VIP', () async {
    when(
      () => repository.sendMessage(
        message: any(named: 'message'),
        sessionId: any(named: 'sessionId'),
      ),
    ).thenThrow(
      const ServerException('AI quota exceeded for today', statusCode: 429),
    );

    await cubit.sendMessage('Hỏi tiếp');

    expect(cubit.state.isLoading, false);
    final lastMessage = cubit.state.messages.last;
    expect(lastMessage.isError, true);
    expect(lastMessage.text.contains('hạn mức'), true);
    expect(lastMessage.badge, 'HẾT LƯỢT HÔM NAY');
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
    expect(lastMessage.badge, 'LỖI KẾT NỐI');
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
