import 'package:intervue_flutter/features/chat/data/models/chat_request.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_response.dart';

abstract class IChatRepository {
  Future<ChatResponse> sendMessage({
    required String message,
    String? sessionId,
    String? faqCode,
    ChatContext? context,
  });
}
