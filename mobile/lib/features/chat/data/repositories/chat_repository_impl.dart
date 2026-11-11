import 'package:intervue_flutter/features/chat/data/datasources/chat_remote_data_source.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_request.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_response.dart';
import 'package:intervue_flutter/features/chat/domain/repositories/i_chat_repository.dart';

class ChatRepositoryImpl implements IChatRepository {
  ChatRepositoryImpl(this.remoteDataSource);

  final ChatRemoteDataSource remoteDataSource;

  @override
  Future<ChatResponse> sendMessage({
    required String message,
    String? sessionId,
    String? faqCode,
    ChatContext? context,
  }) {
    return remoteDataSource.sendMessage(
      ChatRequest(
        message: message,
        sessionId: sessionId,
        faqCode: faqCode,
        context: context,
      ),
    );
  }
}
