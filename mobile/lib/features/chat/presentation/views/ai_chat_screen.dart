import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/di/injection_container.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_request.dart';
import 'package:intervue_flutter/features/chat/domain/entities/chat_suggestion.dart';
import 'package:intervue_flutter/features/chat/presentation/controllers/chat_cubit.dart';
import 'package:intervue_flutter/features/chat/presentation/controllers/chat_state.dart';
import 'package:intervue_flutter/features/chat/presentation/widgets/chat_link_resolver.dart';
import 'package:intervue_flutter/features/chat/presentation/widgets/chat_markdown.dart';

class AiChatScreen extends StatelessWidget {
  const AiChatScreen({super.key, this.initialContext});

  final ChatContext? initialContext;

  @override
  Widget build(BuildContext context) {
    try {
      final cubit = context.read<ChatCubit>();
      if (initialContext != null) {
        cubit.setChatContext(initialContext);
      }
      return _AiChatView(initialContext: initialContext);
    } catch (_) {
      return BlocProvider(
        create: (_) {
          final cubit = getIt<ChatCubit>();
          if (initialContext != null) {
            cubit.setChatContext(initialContext);
          }
          return cubit;
        },
        child: _AiChatView(initialContext: initialContext),
      );
    }
  }
}

class _AiChatView extends StatefulWidget {
  const _AiChatView({this.initialContext});

  final ChatContext? initialContext;

  @override
  State<_AiChatView> createState() => _AiChatViewState();
}

class _AiChatViewState extends State<_AiChatView> {
  final _textController = TextEditingController();
  final _scrollController = ScrollController();
  final _focusNode = FocusNode();

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _handleSend([String? presetText, String? faqCode]) {
    final query = presetText ?? _textController.text.trim();
    if (query.isEmpty) return;

    if (presetText == null) {
      _textController.clear();
    }

    context.read<ChatCubit>().sendMessage(query, faqCode: faqCode);
  }

  void _showTopicSelector() {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(20),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Choose a topic to ask about',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 14),
              _topicTile(
                icon: Icons.search_rounded,
                color: const Color(0xFF0284C7),
                title: 'Find matching jobs',
                subtitle: 'Job suggestions by skills, level and location',
                suggestion: ChatSuggestions.assistant[0],
              ),
              _topicTile(
                icon: Icons.assignment_turned_in_rounded,
                color: AppColors.primary,
                title: 'My applications',
                subtitle: 'Check the status of submitted applications',
                suggestion: ChatSuggestions.assistant[1],
              ),
              _topicTile(
                icon: Icons.apartment_rounded,
                color: const Color(0xFF8B5CF6),
                title: 'Company lookup',
                subtitle: 'Company info and open positions',
                suggestion: ChatSuggestions.assistant[2],
              ),
              _topicTile(
                icon: Icons.description_rounded,
                color: const Color(0xFFF59E0B),
                title: 'ATS-ready CV',
                subtitle: 'How to create and optimize a CV that passes ATS',
                suggestion: ChatSuggestions.faq[1],
              ),
              _topicTile(
                icon: Icons.record_voice_over_rounded,
                color: const Color(0xFFEF4444),
                title: 'AI Mock Interview',
                subtitle: 'How InterVue supports AI interview practice',
                suggestion: ChatSuggestions.faq[4],
              ),
              _topicTile(
                icon: Icons.lock_outline_rounded,
                color: const Color(0xFF475569),
                title: 'Account security',
                subtitle: 'Turn on two-factor authentication (2FA)',
                suggestion: ChatSuggestions.faq[3],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _topicTile({
    required IconData icon,
    required Color color,
    required String title,
    required String subtitle,
    required ChatSuggestion suggestion,
  }) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
      leading: Container(
        width: 44,
        height: 44,
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: color, size: 22),
      ),
      title: Text(
        title,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
      ),
      subtitle: Text(
        subtitle,
        style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
      ),
      trailing: const Icon(
        Icons.arrow_forward_ios_rounded,
        size: 14,
        color: Color(0xFF94A3B8),
      ),
      onTap: () {
        Navigator.pop(context);
        _handleSend(suggestion.text, suggestion.faqCode);
      },
    );
  }

  void _openLink(String url) {
    final route = ChatLinkResolver.routeFor(url);
    if (route != null) {
      context.push(route);
      return;
    }
    final messenger = ScaffoldMessenger.of(context);
    if (ChatLinkResolver.isExternal(url)) {
      Clipboard.setData(ClipboardData(text: url));
      messenger.showSnackBar(
        const SnackBar(
          content: Text('Link copied to clipboard.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }
    messenger.showSnackBar(
      const SnackBar(
        content: Text(
          'This section is only available on the InterVue website.',
        ),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _clearChatHistory() {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Start a new conversation?'),
        content: const Text(
          'All messages in the current chat session will be cleared. Are you sure?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              context.read<ChatCubit>().resetSession();
            },
            child: const Text('Start new'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<ChatCubit, ChatState>(
      listener: (context, state) {
        _scrollToBottom();
      },
      builder: (context, state) {
        return Scaffold(
          backgroundColor: const Color(0xFFF8FAFC),
          appBar: _buildAppBar(state),
          body: LayoutBuilder(
            builder: (context, constraints) {
              final isDesktop = constraints.maxWidth >= 900;
              if (isDesktop) {
                return Row(
                  children: [
                    SizedBox(width: 320, child: _buildDesktopSidebar(state)),
                    const VerticalDivider(width: 1, color: Color(0xFFE2E8F0)),
                    Expanded(
                      child: Center(
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 860),
                          child: _buildChatMainArea(state),
                        ),
                      ),
                    ),
                  ],
                );
              }

              return _buildChatMainArea(state);
            },
          ),
        );
      },
    );
  }

  PreferredSizeWidget _buildAppBar(ChatState state) {
    return AppBar(
      elevation: 0,
      backgroundColor: Colors.white,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 18),
        onPressed: () {
          if (Navigator.of(context).canPop()) {
            Navigator.of(context).pop();
          } else {
            context.go(RouteNames.jobs);
          }
        },
      ),
      titleSpacing: 0,
      title: Row(
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFE6F4EA), Color(0xFFC7EBD1)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.primary, width: 1.5),
                ),
                child: ClipOval(
                  child: Image.asset(
                    'assets/images/intervue-bot.png',
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => const Icon(
                      Icons.smart_toy_rounded,
                      color: AppColors.primary,
                      size: 22,
                    ),
                  ),
                ),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  width: 11,
                  height: 11,
                  decoration: BoxDecoration(
                    color: const Color(0xFF10B981),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 10),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      'InterVue Bot AI',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF0F172A),
                      ),
                    ),
                    SizedBox(width: 5),
                    Icon(
                      Icons.verified_rounded,
                      color: AppColors.primary,
                      size: 15,
                    ),
                  ],
                ),
                Text(
                  'Jobs & platform support assistant',
                  style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                ),
              ],
            ),
          ),
        ],
      ),
      actions: [
        IconButton(
          tooltip: 'Choose a topic',
          icon: const Icon(Icons.tune_rounded, color: Color(0xFF475569)),
          onPressed: _showTopicSelector,
        ),
        IconButton(
          tooltip: 'Start a new conversation',
          icon: const Icon(Icons.refresh_rounded, color: Color(0xFF475569)),
          onPressed: _clearChatHistory,
        ),
        const SizedBox(width: 4),
      ],
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),
        child: Container(color: const Color(0xFFE2E8F0), height: 1),
      ),
    );
  }

  Widget _buildDesktopSidebar(ChatState state) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF00B14F), Color(0xFF00873C)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(18),
            ),
            child: const Row(
              children: [
                Icon(Icons.auto_awesome, color: Colors.white, size: 28),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'InterVue AI',
                        style: TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                      SizedBox(height: 3),
                      Text(
                        'Ask about jobs, companies, applications',
                        style: TextStyle(
                          color: Color(0xFFA7F3D0),
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'SUGGESTED QUESTIONS',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.8,
              color: Color(0xFF94A3B8),
            ),
          ),
          const SizedBox(height: 10),
          Expanded(
            child: ListView(
              children: ChatSuggestions.all.map((prompt) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(12),
                    onTap: () => _handleSend(prompt.text, prompt.faqCode),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 10,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Text(
                              prompt.text,
                              style: const TextStyle(
                                fontSize: 12.5,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF334155),
                              ),
                            ),
                          ),
                          const Icon(
                            Icons.chevron_right_rounded,
                            size: 16,
                            color: Color(0xFF94A3B8),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChatMainArea(ChatState state) {
    return Column(
      children: [
        if (state.chatContext != null && state.chatContext?.jobTitle != null)
          _buildContextBanner(state.chatContext!),
        Expanded(
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
            itemCount: state.messages.length + (state.isLoading ? 1 : 0),
            itemBuilder: (context, index) {
              if (index < state.messages.length) {
                return _buildMessageItem(state.messages[index]);
              }
              return _buildTypingIndicator();
            },
          ),
        ),
        _buildQuickPromptsBar(state),
        _buildInputBar(state),
      ],
    );
  }

  Widget _buildContextBanner(ChatContext ctx) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: const BoxDecoration(
        color: Color(0xFFEFF6FF),
        border: Border(bottom: BorderSide(color: Color(0xFFBFDBFE))),
      ),
      child: Row(
        children: [
          const Icon(
            Icons.work_outline_rounded,
            size: 16,
            color: Color(0xFF1D4ED8),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'Viewing: ${ctx.jobTitle ?? "Job"}${ctx.companyName != null ? " • ${ctx.companyName}" : ""}',
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Color(0xFF1E40AF),
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickPromptsBar(ChatState state) {
    final hasJobContext =
        state.chatContext != null && state.chatContext?.jobTitle != null;
    final contextPrompts = hasJobContext
        ? const [
            ChatSuggestion('🎯 Match my resume to this job'),
            ChatSuggestion('✍️ Draft a cover letter for this job opening'),
          ]
        : const <ChatSuggestion>[];
    final prompts = [...contextPrompts, ...ChatSuggestions.all];

    return Container(
      height: 44,
      color: Colors.white,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        scrollDirection: Axis.horizontal,
        itemCount: prompts.length,
        separatorBuilder: (_, _) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final prompt = prompts[index];
          final isContextPrompt = index < contextPrompts.length;
          return ActionChip(
            label: Text(
              prompt.text,
              style: TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.w600,
                color: isContextPrompt
                    ? const Color(0xFF1E40AF)
                    : const Color(0xFF334155),
              ),
            ),
            backgroundColor: isContextPrompt
                ? const Color(0xFFEFF6FF)
                : const Color(0xFFF1F5F9),
            elevation: 0,
            pressElevation: 1,
            side: BorderSide(
              color: isContextPrompt
                  ? const Color(0xFFBFDBFE)
                  : const Color(0xFFE2E8F0),
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(999),
            ),
            onPressed: () => _handleSend(
              isContextPrompt
                  ? prompt.text.substring(prompt.text.indexOf(' ') + 1)
                  : prompt.text,
              prompt.faqCode,
            ),
          );
        },
      ),
    );
  }

  Widget _buildMessageItem(ChatMessageItem msg) {
    if (msg.isUser) {
      return Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.end,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            Flexible(
              child: Container(
                constraints: const BoxConstraints(maxWidth: 500),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF059669), Color(0xFF00B14F)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                    bottomLeft: Radius.circular(20),
                    bottomRight: Radius.circular(4),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.primary.withValues(alpha: 0.18),
                      blurRadius: 8,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Text(
                  msg.text,
                  style: const TextStyle(
                    fontSize: 14.5,
                    color: Colors.white,
                    height: 1.45,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            const CircleAvatar(
              radius: 15,
              backgroundColor: Color(0xFF00B14F),
              child: Icon(Icons.person_rounded, color: Colors.white, size: 18),
            ),
          ],
        ),
      );
    }

    final isError = msg.isError;
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            margin: const EdgeInsets.only(top: 2),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isError
                    ? const [Color(0xFFFEE2E2), Color(0xFFFECACA)]
                    : const [Color(0xFFE6F4EA), Color(0xFFC7EBD1)],
              ),
              shape: BoxShape.circle,
              border: Border.all(
                color: isError ? Colors.redAccent : AppColors.primary,
                width: 1.2,
              ),
            ),
            child: ClipOval(
              child: isError
                  ? const Icon(
                      Icons.warning_amber_rounded,
                      color: Colors.redAccent,
                      size: 20,
                    )
                  : Image.asset(
                      'assets/images/intervue-bot.png',
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => const Icon(
                        Icons.smart_toy_rounded,
                        color: AppColors.primary,
                        size: 20,
                      ),
                    ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (msg.badge != null) ...[
                  Container(
                    margin: const EdgeInsets.only(bottom: 6),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2.5,
                    ),
                    decoration: BoxDecoration(
                      color: isError
                          ? const Color(0xFFFEF2F2)
                          : const Color(0xFFE6F4EA),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(
                        color: isError
                            ? Colors.redAccent.withValues(alpha: 0.3)
                            : AppColors.primary.withValues(alpha: 0.25),
                      ),
                    ),
                    child: Text(
                      msg.badge!,
                      style: TextStyle(
                        fontSize: 9.5,
                        fontWeight: FontWeight.bold,
                        color: isError
                            ? Colors.redAccent
                            : AppColors.primaryDarker,
                        letterSpacing: 0.4,
                      ),
                    ),
                  ),
                ],
                Container(
                  constraints: const BoxConstraints(maxWidth: 620),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 14,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(4),
                      topRight: Radius.circular(20),
                      bottomLeft: Radius.circular(20),
                      bottomRight: Radius.circular(20),
                    ),
                    border: Border.all(
                      color: isError
                          ? Colors.redAccent.withValues(alpha: 0.3)
                          : const Color(0xFFE2E8F0),
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.03),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ChatMarkdown(text: msg.text, onLinkTap: _openLink),

                      if (msg.sources != null && msg.sources!.isNotEmpty) ...[
                        const SizedBox(height: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Row(
                                children: [
                                  Icon(
                                    Icons.library_books_rounded,
                                    size: 13,
                                    color: Color(0xFF64748B),
                                  ),
                                  SizedBox(width: 5),
                                  Text(
                                    'Sources:',
                                    style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                      color: Color(0xFF475569),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              ...msg.sources!.map(
                                (s) => Padding(
                                  padding: const EdgeInsets.only(top: 2),
                                  child: Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        '• ',
                                        style: TextStyle(
                                          fontSize: 11,
                                          color: Color(0xFF64748B),
                                        ),
                                      ),
                                      Expanded(
                                        child: Text(
                                          s,
                                          style: const TextStyle(
                                            fontSize: 11,
                                            color: Color(0xFF475569),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],

                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          InkWell(
                            onTap: () {
                              Clipboard.setData(ClipboardData(text: msg.text));
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Reply copied to clipboard.'),
                                  duration: Duration(seconds: 2),
                                  behavior: SnackBarBehavior.floating,
                                ),
                              );
                            },
                            borderRadius: BorderRadius.circular(6),
                            child: const Padding(
                              padding: EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 3,
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    Icons.copy_rounded,
                                    size: 13,
                                    color: Color(0xFF94A3B8),
                                  ),
                                  SizedBox(width: 4),
                                  Text(
                                    'Copy',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: Color(0xFF94A3B8),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                if (msg.actions != null && msg.actions!.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: msg.actions!.map((action) {
                      return ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isError
                              ? AppColors.primary
                              : Colors.white,
                          foregroundColor: isError
                              ? Colors.white
                              : AppColors.primary,
                          elevation: 0,
                          side: const BorderSide(color: AppColors.primary),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 8,
                          ),
                        ),
                        icon: Icon(action.icon, size: 16),
                        label: Text(
                          action.label,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                        onPressed: () {
                          if (action.route != null) {
                            context.push(action.route!);
                          } else if (action.query != null) {
                            _handleSend(action.query!, action.faqCode);
                          }
                        },
                      );
                    }).toList(),
                  ),
                ],
                if (msg.suggestedChips != null &&
                    msg.suggestedChips!.isNotEmpty) ...[
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: msg.suggestedChips!.map((chip) {
                      return InkWell(
                        onTap: () => _handleSend(chip.text, chip.faqCode),
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 11,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: const Color(0xFFCBD5E1)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.bolt_rounded,
                                size: 13,
                                color: Color(0xFFF59E0B),
                              ),
                              const SizedBox(width: 4),
                              Text(
                                chip.text,
                                style: const TextStyle(
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFF334155),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTypingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFE6F4EA), Color(0xFFC7EBD1)],
              ),
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.primary, width: 1.2),
            ),
            child: ClipOval(
              child: Image.asset(
                'assets/images/intervue-bot.png',
                fit: BoxFit.cover,
                errorBuilder: (_, _, _) => const Icon(
                  Icons.smart_toy_rounded,
                  color: AppColors.primary,
                  size: 20,
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _PulsingDot(delay: 0),
                SizedBox(width: 4),
                _PulsingDot(delay: 200),
                SizedBox(width: 4),
                _PulsingDot(delay: 400),
                SizedBox(width: 8),
                Text(
                  'InterVue AI is thinking...',
                  style: TextStyle(
                    fontSize: 12,
                    fontStyle: FontStyle.italic,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInputBar(ChatState state) {
    final isBlocked = state.isLoading;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        border: const Border(top: BorderSide(color: Color(0xFFE2E8F0))),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFCBD5E1)),
                ),
                child: TextField(
                  controller: _textController,
                  focusNode: _focusNode,
                  maxLines: 4,
                  minLines: 1,
                  enabled: !isBlocked,
                  textInputAction: TextInputAction.send,
                  onSubmitted: (_) => _handleSend(),
                  decoration: InputDecoration(
                    hintText: isBlocked
                        ? 'InterVue AI is replying...'
                        : 'Ask about jobs, companies, applications...',
                    hintStyle: const TextStyle(
                      fontSize: 13,
                      color: Color(0xFF94A3B8),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 10,
                    ),
                    border: InputBorder.none,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            Material(
              color: isBlocked ? const Color(0xFFCBD5E1) : AppColors.primary,
              shape: const CircleBorder(),
              elevation: isBlocked ? 0 : 2,
              child: InkWell(
                customBorder: const CircleBorder(),
                onTap: isBlocked ? null : () => _handleSend(),
                child: const Padding(
                  padding: EdgeInsets.all(11),
                  child: Icon(
                    Icons.send_rounded,
                    color: Colors.white,
                    size: 20,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _PulsingDot extends StatefulWidget {
  const _PulsingDot({required this.delay});
  final int delay;

  @override
  State<_PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<_PulsingDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _animation = Tween<double>(
      begin: 0.3,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));

    Future.delayed(Duration(milliseconds: widget.delay), () {
      if (mounted) {
        _controller.repeat(reverse: true);
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Opacity(
          opacity: _animation.value,
          child: Container(
            width: 7,
            height: 7,
            decoration: const BoxDecoration(
              color: AppColors.primary,
              shape: BoxShape.circle,
            ),
          ),
        );
      },
    );
  }
}
