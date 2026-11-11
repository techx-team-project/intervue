import 'dart:async';

import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

enum AppMessageType { success, error }

class AppMessage {
  const AppMessage(this.text, this.type);

  final String text;
  final AppMessageType type;
}

abstract final class AppMessenger {
  static const Duration _visibleFor = Duration(seconds: 3);

  static final ValueNotifier<AppMessage?> current = ValueNotifier(null);
  static Timer? _timer;

  static void success(String message) =>
      _show(AppMessage(message, AppMessageType.success));

  static void error(String message) =>
      _show(AppMessage(message, AppMessageType.error));

  static void dismiss() {
    _timer?.cancel();
    current.value = null;
  }

  static void _show(AppMessage message) {
    _timer?.cancel();
    current.value = message;
    _timer = Timer(_visibleFor, dismiss);
  }
}

class AppBannerHost extends StatelessWidget {
  const AppBannerHost({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<AppMessage?>(
      valueListenable: AppMessenger.current,
      builder: (context, message, _) {
        return Positioned(
          top: 0,
          left: 0,
          right: 0,
          child: SafeArea(
            bottom: false,
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 280),
              reverseDuration: const Duration(milliseconds: 200),
              transitionBuilder: (child, animation) => SlideTransition(
                position:
                    Tween<Offset>(
                      begin: const Offset(0, -1.2),
                      end: Offset.zero,
                    ).animate(
                      CurvedAnimation(
                        parent: animation,
                        curve: Curves.easeOutCubic,
                      ),
                    ),
                child: child,
              ),
              child: message == null
                  ? const SizedBox.shrink(key: ValueKey('no-message'))
                  : _Banner(key: ValueKey(message), message: message),
            ),
          ),
        );
      },
    );
  }
}

class _Banner extends StatelessWidget {
  const _Banner({required this.message, super.key});

  final AppMessage message;

  @override
  Widget build(BuildContext context) {
    final isSuccess = message.type == AppMessageType.success;
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
      child: Material(
        color: isSuccess ? AppColors.primary : AppColors.error,
        elevation: 8,
        shadowColor: Colors.black45,
        borderRadius: BorderRadius.circular(14),
        child: InkWell(
          borderRadius: BorderRadius.circular(14),
          onTap: AppMessenger.dismiss,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            child: Row(
              children: [
                Icon(
                  isSuccess
                      ? Icons.check_circle_rounded
                      : Icons.error_outline_rounded,
                  color: Colors.white,
                  size: 22,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    message.text,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
