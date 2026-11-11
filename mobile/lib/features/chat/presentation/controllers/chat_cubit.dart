import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_request.dart';
import 'package:intervue_flutter/features/chat/domain/repositories/i_chat_repository.dart';
import 'package:intervue_flutter/features/chat/presentation/controllers/chat_state.dart';

class ChatCubit extends Cubit<ChatState> {
  static int _sessionCounter = 0;

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
          'Xin chào bạn! Mình là **InterVue Bot AI** 🤖 — Trợ lý ảo tư vấn nghề nghiệp & luyện phỏng vấn thông minh của hệ sinh thái InterVue.\n\n'
          'Hôm nay mình có thể đồng hành cùng bạn:\n'
          '• 📄 **Chấm điểm & tối ưu CV** vượt qua bộ lọc ATS của 320.000+ Nhà tuyển dụng\n'
          '• 🎙️ **Luyện phỏng vấn giả lập 1:1** phản hồi thời gian thực theo phương pháp STAR\n'
          '• 💰 **Khảo sát lương thị trường** theo từng cấp bậc & công nghệ\n'
          '• 🚀 **Định hướng lộ trình sự nghiệp** rõ ràng và bứt phá thu nhập\n\n'
          'Hãy chọn một gợi ý bên dưới hoặc nhắn tin bất kỳ câu hỏi nào bạn đang quan tâm nhé!',
      isUser: false,
      timestamp: DateTime.now(),
      badge: 'INTERVUE AI 4.0',
      actions: const [
        ChatAction(
          label: 'Tạo / Quản lý CV',
          icon: Icons.description_rounded,
          route: RouteNames.resume,
        ),
        ChatAction(
          label: 'Khám phá việc làm',
          icon: Icons.work_outline_rounded,
          route: RouteNames.jobs,
        ),
        ChatAction(
          label: 'Nâng cấp VIP AI',
          icon: Icons.workspace_premium_rounded,
          route: RouteNames.upgrade,
        ),
      ],
      suggestedChips: const [
        'Chấm điểm CV của tôi',
        'Luyện phỏng vấn giả lập',
        'Mức lương Flutter Developer?',
        'Cách trả lời điểm yếu trong phỏng vấn',
      ],
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

      final lower = query.toLowerCase();
      final aiMessage = ChatMessageItem(
        id: 'ai_${DateTime.now().millisecondsSinceEpoch}',
        text: response.answer,
        isUser: false,
        timestamp: DateTime.now(),
        badge: 'INTERVUE BOT AI',
        sources: response.sources.isNotEmpty ? response.sources : null,
        actions: _resolveContextActions(lower),
        suggestedChips: _resolveContextChips(lower),
      );

      emit(
        state.copyWith(
          messages: List<ChatMessageItem>.from(state.messages)..add(aiMessage),
          isLoading: false,
          remainingQuota: response.remainingQuota,
        ),
      );
    } catch (e) {
      final failure = Failure.fromException(e);
      final errorText = failure.message.toLowerCase();
      final isQuotaError =
          errorText.contains('quota') ||
          errorText.contains('limit') ||
          errorText.contains('hạn mức') ||
          errorText.contains('lượt');

      final ChatMessageItem errorMessage;
      if (isQuotaError) {
        errorMessage = ChatMessageItem(
          id: 'err_${DateTime.now().millisecondsSinceEpoch}',
          text:
              '⚠️ **Bạn đã sử dụng hết hạn mức AI hôm nay.**\n\n'
              'Hãy nâng cấp tài khoản VIP để tiếp tục đặt câu hỏi, nhận gợi ý phỏng vấn chuyên sâu và tối ưu CV không giới hạn!',
          isUser: false,
          timestamp: DateTime.now(),
          badge: 'HẾT LƯỢT HÔM NAY',
          isError: true,
          actions: const [
            ChatAction(
              label: 'Nâng cấp VIP ngay',
              icon: Icons.workspace_premium_rounded,
              route: RouteNames.upgrade,
            ),
          ],
        );
      } else {
        errorMessage = ChatMessageItem(
          id: 'err_${DateTime.now().millisecondsSinceEpoch}',
          text:
              '⚠️ **Không thể kết nối đến máy chủ AI:**\n${failure.message}\n\n'
              'Vui lòng kiểm tra kết nối mạng hoặc thử lại sau giây lát.',
          isUser: false,
          timestamp: DateTime.now(),
          badge: 'LỖI KẾT NỐI',
          isError: true,
          actions: [
            ChatAction(
              label: 'Thử lại câu hỏi này',
              icon: Icons.refresh_rounded,
              query: query,
            ),
          ],
          suggestedChips: const [
            'Chấm điểm CV của tôi',
            'Xem danh sách việc làm mới',
          ],
        );
      }

      emit(
        state.copyWith(
          messages: List<ChatMessageItem>.from(state.messages)
            ..add(errorMessage),
          isLoading: false,
          errorMessage: failure.message,
        ),
      );
    }
  }

  void resetSession() {
    emit(
      ChatState(
        sessionId: _nextSessionId(),
        remainingQuota: state.remainingQuota,
        chatContext: state.chatContext,
      ),
    );
    init();
  }

  List<ChatAction>? _resolveContextActions(String query) {
    if (query.contains('cv') ||
        query.contains('hồ sơ') ||
        query.contains('ats')) {
      return const [
        ChatAction(
          label: 'Mở trang tạo CV',
          icon: Icons.edit_document,
          route: RouteNames.resume,
        ),
        ChatAction(
          label: 'Nâng cấp VIP phân tích ATS',
          icon: Icons.auto_awesome,
          route: RouteNames.upgrade,
        ),
      ];
    }
    if (query.contains('lương') ||
        query.contains('việc') ||
        query.contains('job')) {
      return const [
        ChatAction(
          label: 'Khám phá việc làm ngay',
          icon: Icons.search_rounded,
          route: RouteNames.jobs,
        ),
      ];
    }
    if (query.contains('vip') ||
        query.contains('gói') ||
        query.contains('nâng cấp')) {
      return const [
        ChatAction(
          label: 'Xem các gói VIP',
          icon: Icons.workspace_premium_rounded,
          route: RouteNames.upgrade,
        ),
      ];
    }
    return null;
  }

  List<String>? _resolveContextChips(String query) {
    if (query.contains('cv') || query.contains('ats')) {
      return const [
        'Ví dụ mô tả kinh nghiệm chuẩn',
        'Các lỗi khiến CV bị loại sớm',
        'Nên viết mục Mục tiêu nghề nghiệp thế nào?',
      ];
    }
    if (query.contains('phỏng vấn') || query.contains('interview')) {
      return const [
        'Gợi ý câu trả lời theo mô hình STAR',
        'Cách trả lời câu hỏi: Điểm yếu của bạn là gì?',
        'Những câu hỏi nên hỏi lại nhà tuyển dụng',
      ];
    }
    if (query.contains('lương')) {
      return const [
        'Kỹ năng nào được trả lương cao nhất 2026?',
        'Cách đàm phán deal lương tăng 20-30%',
      ];
    }
    return const [
      'Tối ưu CV của tôi chuẩn ATS',
      'Luyện phỏng vấn thử câu hỏi khó',
      'Khám phá cơ hội việc làm mới',
    ];
  }
}
