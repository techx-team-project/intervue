import 'package:equatable/equatable.dart';
import 'package:flutter/widgets.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_request.dart';

class ChatAction extends Equatable {
  const ChatAction({
    required this.label,
    required this.icon,
    this.route,
    this.query,
  });

  final String label;
  final IconData icon;
  final String? route;
  final String? query;

  @override
  List<Object?> get props => [label, icon, route, query];
}

class ChatMessageItem extends Equatable {
  const ChatMessageItem({
    required this.id,
    required this.text,
    required this.isUser,
    required this.timestamp,
    this.actions,
    this.suggestedChips,
    this.badge,
    this.sources,
    this.isError = false,
  });

  final String id;
  final String text;
  final bool isUser;
  final DateTime timestamp;
  final List<ChatAction>? actions;
  final List<String>? suggestedChips;
  final String? badge;
  final List<String>? sources;
  final bool isError;

  @override
  List<Object?> get props => [
    id,
    text,
    isUser,
    timestamp,
    actions,
    suggestedChips,
    badge,
    sources,
    isError,
  ];
}

class ChatState extends Equatable {
  const ChatState({
    this.messages = const [],
    this.isLoading = false,
    this.remainingQuota,
    required this.sessionId,
    this.errorMessage,
    this.chatContext,
  });

  final List<ChatMessageItem> messages;
  final bool isLoading;
  final int? remainingQuota;
  final String sessionId;
  final String? errorMessage;
  final ChatContext? chatContext;

  ChatState copyWith({
    List<ChatMessageItem>? messages,
    bool? isLoading,
    int? remainingQuota,
    String? sessionId,
    String? errorMessage,
    ChatContext? chatContext,
  }) {
    return ChatState(
      messages: messages ?? this.messages,
      isLoading: isLoading ?? this.isLoading,
      remainingQuota: remainingQuota ?? this.remainingQuota,
      sessionId: sessionId ?? this.sessionId,
      errorMessage: errorMessage,
      chatContext: chatContext ?? this.chatContext,
    );
  }

  @override
  List<Object?> get props => [
    messages,
    isLoading,
    remainingQuota,
    sessionId,
    errorMessage,
    chatContext,
  ];
}
