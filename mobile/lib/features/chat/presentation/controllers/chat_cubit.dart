import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/errors/ai_failure_message.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_request.dart';
import 'package:intervue_flutter/features/chat/domain/entities/chat_suggestion.dart';
import 'package:intervue_flutter/features/chat/domain/repositories/i_chat_repository.dart';
import 'package:intervue_flutter/features/chat/presentation/controllers/chat_state.dart';

class ChatCubit extends Cubit<ChatState> {
  static int _sessionCounter = 0;

  static const Set<String> _aiUnavailableCodes = {
    'AI_NOT_CONFIGURED',
    'AI_PROVIDER_BUSY',
    'AI_PROVIDER_TIMEOUT',
    'AI_PROVIDER_ERROR',
    'AI_REQUEST_REFUSED',
  };

  static String _nextSessionId() =>
      'session_${DateTime.now().millisecondsSinceEpoch}_${++_sessionCounter}';

  ChatCubit(this._repository) : super(ChatState(sessionId: _nextSessionId())) {
    init();
  }

  final IChatRepository _repository;

  void init() {
    final welcome = ChatMessageItem(
      id: 'welcome_1',
      text:
          'Hello! 👋 I am the **InterVue AI assistant** 🤖. I can help you with:\n\n'
          '• 🔍 **Finding IT jobs** by skills, level and location\n'
          '• 🏢 **Looking up companies** that are hiring\n'
          '• 📋 **Tracking the status** of your applications\n'
          '• 🎯 **Matching your resume to a job** and **drafting a cover letter** (open the chat from a job detail page)\n'
          '• 📖 **Platform guidance**: ATS-ready CV, 2FA, AI interview practice...\n\n'
          'Pick a suggestion below or ask me anything!',
      isUser: false,
      timestamp: DateTime.now(),
      badge: 'INTERVUE AI',
      actions: const [
        ChatAction(
          label: 'Create / Manage CV',
          icon: Icons.description_rounded,
          route: RouteNames.resume,
        ),
        ChatAction(
          label: 'Explore jobs',
          icon: Icons.work_outline_rounded,
          route: RouteNames.jobs,
        ),
      ],
      suggestedChips: ChatSuggestions.all,
    );

    emit(state.copyWith(messages: [welcome]));
  }

  void setChatContext(ChatContext? context) {
    emit(state.copyWith(chatContext: context));
  }

  Future<void> sendMessage(
    String text, {
    String? faqCode,
    ChatContext? context,
  }) async {
    final query = text.trim();
    if (query.isEmpty || state.isLoading) return;

    final userMessage = ChatMessageItem(
      id: 'user_${DateTime.now().millisecondsSinceEpoch}',
      text: query,
      isUser: true,
      timestamp: DateTime.now(),
    );

    final currentMessages = List<ChatMessageItem>.from(state.messages)
      ..add(userMessage);
    emit(
      state.copyWith(
        messages: currentMessages,
        isLoading: true,
        errorMessage: null,
      ),
    );

    final effectiveContext = context ?? state.chatContext;

    try {
      final response = await _repository.sendMessage(
        message: query,
        sessionId: state.sessionId,
        faqCode: faqCode,
        context: effectiveContext,
      );

      final aiMessage = ChatMessageItem(
        id: 'ai_${DateTime.now().millisecondsSinceEpoch}',
        text: response.answer,
        isUser: false,
        timestamp: DateTime.now(),
        badge: 'INTERVUE AI',
        sources: response.sources.isNotEmpty ? response.sources : null,
        actions: _resolveContextActions(query.toLowerCase()),
      );

      emit(
        state.copyWith(
          messages: List<ChatMessageItem>.from(state.messages)..add(aiMessage),
          isLoading: false,
        ),
      );
    } catch (e) {
      final failure = Failure.fromException(e);
      emit(
        state.copyWith(
          messages: List<ChatMessageItem>.from(state.messages)
            ..add(_buildErrorMessage(failure, query, faqCode)),
          isLoading: false,
          errorMessage: failure.message,
        ),
      );
    }
  }

  void resetSession() {
    emit(
      ChatState(sessionId: _nextSessionId(), chatContext: state.chatContext),
    );
    init();
  }

  ChatMessageItem _buildErrorMessage(
    Failure failure,
    String query,
    String? faqCode,
  ) {
    final id = 'err_${DateTime.now().millisecondsSinceEpoch}';
    final code = failure is ServerFailure ? failure.code : null;
    final retryAfter = failure is ServerFailure
        ? failure.retryAfterSeconds
        : null;
    final retryAction = ChatAction(
      label: 'Retry this question',
      icon: Icons.refresh_rounded,
      query: query,
      faqCode: faqCode,
    );

    if (code == 'RATE_LIMITED') {
      final wait = retryAfter != null && retryAfter > 0
          ? 'Please try again in $retryAfter seconds.'
          : 'Please try again in a few minutes.';
      return ChatMessageItem(
        id: id,
        text: '⚠️ **You are sending questions too quickly.**\n\n$wait',
        isUser: false,
        timestamp: DateTime.now(),
        badge: 'TOO MANY REQUESTS',
        isError: true,
        actions: [retryAction],
      );
    }

    if (_aiUnavailableCodes.contains(code)) {
      return ChatMessageItem(
        id: id,
        text:
            '⚠️ **The AI assistant cannot respond right now.**\n\n'
            'The AI service is busy or unavailable. Please try again shortly.',
        isUser: false,
        timestamp: DateTime.now(),
        badge: 'AI BUSY',
        isError: true,
        actions: [retryAction],
      );
    }

    return ChatMessageItem(
      id: id,
      text:
          '⚠️ **Could not reach the AI server:**\n${aiFailureMessage(failure)}\n\n'
          'Please check your connection or try again shortly.',
      isUser: false,
      timestamp: DateTime.now(),
      badge: 'CONNECTION ERROR',
      isError: true,
      actions: [retryAction],
    );
  }

  List<ChatAction>? _resolveContextActions(String query) {
    if (query.contains('cv') ||
        query.contains('resume') ||
        query.contains('ats')) {
      return const [
        ChatAction(
          label: 'Open CV page',
          icon: Icons.edit_document,
          route: RouteNames.resume,
        ),
      ];
    }
    if (query.contains('application') || query.contains('apply')) {
      return const [
        ChatAction(
          label: 'View my applications',
          icon: Icons.assignment_turned_in_rounded,
          route: RouteNames.applications,
        ),
      ];
    }
    if (query.contains('salary') ||
        query.contains('opening') ||
        query.contains('job')) {
      return const [
        ChatAction(
          label: 'Explore jobs now',
          icon: Icons.search_rounded,
          route: RouteNames.jobs,
        ),
      ];
    }
    return null;
  }
}
