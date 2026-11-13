import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_request.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_response.dart';

class ChatRemoteDataSource {
  ChatRemoteDataSource(this._client);

  final ApiClient _client;

  Future<ChatResponse> sendMessage(ChatRequest request) async {
    final data = await _client.post(
      ApiEndpoints.aiChat,
      data: request.toJson(),
      receiveTimeout: const Duration(seconds: 60),
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Invalid AI response data');
    }
    return ChatResponse.fromJson(data);
  }
}
