import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/features/security/presentation/controllers/security_cubit.dart';
import 'package:intervue_flutter/features/security/presentation/controllers/security_state.dart';
import 'package:intervue_flutter/features/security/presentation/widgets/change_password_dialog.dart';
import 'package:intervue_flutter/features/security/presentation/widgets/two_factor_setup_dialog.dart';

class AccountSecurityScreen extends StatefulWidget {
  const AccountSecurityScreen({super.key});

  @override
  State<AccountSecurityScreen> createState() => _AccountSecurityScreenState();
}

class _AccountSecurityScreenState extends State<AccountSecurityScreen> {
  @override
  void initState() {
    super.initState();
    context.read<SecurityCubit>().loadSecurityData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'Bảo mật tài khoản',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0.5,
      ),
      body: BlocConsumer<SecurityCubit, SecurityState>(
        listener: (context, state) {
          if (state is SecurityLoaded) {
            if (state.actionMessage != null) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.actionMessage!),
                  backgroundColor: AppColors.primary,
                  behavior: SnackBarBehavior.floating,
                ),
              );
              context.read<SecurityCubit>().clearAction();
            } else if (state.actionError != null) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.actionError!),
                  backgroundColor: AppColors.error,
                  behavior: SnackBarBehavior.floating,
                ),
              );
              context.read<SecurityCubit>().clearAction();
            }

            if (state.setupData != null) {
              TwoFactorSetupDialog.show(
                context,
                setupData: state.setupData!,
                onConfirm: (code) {
                  unawaited(context.read<SecurityCubit>().confirm2Fa(code));
                },
              );
            }
          }
        },
        builder: (context, state) {
          if (state is SecurityLoading || state is SecurityInitial) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state is SecurityError) {
            return Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.error_outline,
                    size: 48,
                    color: AppColors.error,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    state.message,
                    style: const TextStyle(color: AppColors.textSecondary),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () =>
                        context.read<SecurityCubit>().loadSecurityData(),
                    child: const Text('Thử lại'),
                  ),
                ],
              ),
            );
          }

          final loaded = state as SecurityLoaded;
          final is2FaEnabled = loaded.status.enabled;
          final sessions = loaded.sessions;

          return RefreshIndicator(
            onRefresh: () => context.read<SecurityCubit>().loadSecurityData(),
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // 1. Password Section
                _buildCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(
                            Icons.lock_outline,
                            color: AppColors.primary,
                            size: 20,
                          ),
                          SizedBox(width: 8),
                          Text(
                            'Mật khẩu đăng nhập',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Nên đặt mật khẩu mạnh kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 12),
                      OutlinedButton.icon(
                        icon: const Icon(Icons.edit, size: 16),
                        label: const Text('Đổi mật khẩu'),
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.primary,
                          side: const BorderSide(color: AppColors.primary),
                        ),
                        onPressed: () async {
                          final data = await ChangePasswordDialog.show(context);
                          if (data != null && context.mounted) {
                            unawaited(
                              context.read<SecurityCubit>().changePassword(
                                currentPassword: data['currentPassword']!,
                                password: data['password']!,
                                confirmPassword: data['confirmPassword']!,
                              ),
                            );
                          }
                        },
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // 2. Two-Factor Authentication Section
                _buildCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.shield_outlined,
                            color: AppColors.primary,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'Xác thực 2 bước (2FA)',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 3,
                            ),
                            decoration: BoxDecoration(
                              color: is2FaEnabled
                                  ? const Color(0xFFE8F8F0)
                                  : Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              is2FaEnabled ? 'Đang bật' : 'Chưa bật',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: is2FaEnabled
                                    ? AppColors.primary
                                    : AppColors.textSecondary,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        is2FaEnabled
                            ? 'Tài khoản được bảo vệ bằng mã OTP từ ứng dụng xác thực mỗi khi đăng nhập.'
                            : 'Thêm lớp bảo mật bổ sung bằng mã OTP từ Google Authenticator hoặc Authy.',
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      if (is2FaEnabled &&
                          loaded.status.confirmedAt != null) ...[
                        const SizedBox(height: 6),
                        Text(
                          'Kích hoạt ngày: ${DateFormat('dd/MM/yyyy HH:mm').format(loaded.status.confirmedAt!.toLocal())}',
                          style: const TextStyle(
                            fontSize: 11,
                            color: AppColors.textMuted,
                          ),
                        ),
                      ],
                      const SizedBox(height: 12),
                      if (is2FaEnabled)
                        ElevatedButton.icon(
                          icon: const Icon(Icons.lock_open, size: 16),
                          label: const Text('Tắt xác thực 2 bước'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red.shade50,
                            foregroundColor: AppColors.error,
                            elevation: 0,
                          ),
                          onPressed: () async {
                            final confirm = await showDialog<bool>(
                              context: context,
                              builder: (ctx) => AlertDialog(
                                title: const Text('Tắt 2FA?'),
                                content: const Text(
                                  'Bạn có chắc muốn tắt bảo vệ 2 bước cho tài khoản?',
                                ),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(ctx, false),
                                    child: const Text('Hủy'),
                                  ),
                                  TextButton(
                                    onPressed: () => Navigator.pop(ctx, true),
                                    child: const Text(
                                      'Tắt 2FA',
                                      style: TextStyle(color: AppColors.error),
                                    ),
                                  ),
                                ],
                              ),
                            );
                            if (confirm == true && context.mounted) {
                              unawaited(
                                context.read<SecurityCubit>().disable2Fa(),
                              );
                            }
                          },
                        )
                      else
                        ElevatedButton.icon(
                          icon: const Icon(Icons.qr_code, size: 16),
                          label: const Text('Thiết lập 2FA ngay'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: Colors.white,
                          ),
                          onPressed: loaded.isSubmittingAction
                              ? null
                              : () => context
                                    .read<SecurityCubit>()
                                    .initiate2FaSetup(),
                        ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // 3. Active Sessions Section
                _buildCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(
                            Icons.devices,
                            color: AppColors.primary,
                            size: 20,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Thiết bị đăng nhập (${sessions.length})',
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Quản lý các thiết bị và trình duyệt đang duy trì phiên đăng nhập.',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 12),
                      if (sessions.isEmpty)
                        const Padding(
                          padding: EdgeInsets.symmetric(vertical: 8),
                          child: Text(
                            'Không có phiên đăng nhập nào khác.',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppColors.textMuted,
                            ),
                          ),
                        )
                      else
                        ...sessions.map((s) {
                          final dateStr = s.lastUsedAt != null
                              ? DateFormat('dd/MM HH:mm')
                                    .format(s.lastUsedAt!.toLocal())
                              : null;
                          return Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: s.current
                                  ? const Color(0xFFF0FDF4)
                                  : Colors.grey.shade50,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: s.current
                                    ? AppColors.primary.withValues(alpha: 0.3)
                                    : AppColors.border,
                              ),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.smartphone,
                                  size: 20,
                                  color: s.current
                                      ? AppColors.primary
                                      : AppColors.textSecondary,
                                ),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Flexible(
                                            child: Text(
                                              s.deviceLabel,
                                              style: const TextStyle(
                                                fontSize: 13,
                                                fontWeight: FontWeight.bold,
                                                color: AppColors.textPrimary,
                                              ),
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                          if (s.current) ...[
                                            const SizedBox(width: 6),
                                            Container(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                    horizontal: 6,
                                                    vertical: 1,
                                                  ),
                                              decoration: BoxDecoration(
                                                color: AppColors.primary,
                                                borderRadius:
                                                    BorderRadius.circular(4),
                                              ),
                                              child: const Text(
                                                'Hiện tại',
                                                style: TextStyle(
                                                  fontSize: 9.5,
                                                  color: Colors.white,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ],
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        [
                                          if (s.ipAddress != null) s.ipAddress!,
                                          if (s.location != null) s.location!,
                                          if (dateStr != null)
                                            'Hoạt động: $dateStr',
                                        ].join(' • '),
                                        style: const TextStyle(
                                          fontSize: 11,
                                          color: AppColors.textSecondary,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                if (!s.current)
                                  IconButton(
                                    icon: const Icon(
                                      Icons.logout,
                                      size: 18,
                                      color: AppColors.error,
                                    ),
                                    tooltip: 'Đăng xuất thiết bị này',
                                    onPressed: () async {
                                      final confirm = await showDialog<bool>(
                                        context: context,
                                        builder: (ctx) => AlertDialog(
                                          title: const Text(
                                            'Đăng xuất thiết bị?',
                                          ),
                                          content: Text(
                                            'Bạn có chắc muốn kết thúc phiên đăng nhập trên "${s.deviceLabel}"?',
                                          ),
                                          actions: [
                                            TextButton(
                                              onPressed: () =>
                                                  Navigator.pop(ctx, false),
                                              child: const Text('Hủy'),
                                            ),
                                            TextButton(
                                              onPressed: () =>
                                                  Navigator.pop(ctx, true),
                                              child: const Text(
                                                'Đăng xuất',
                                                style: TextStyle(
                                                  color: AppColors.error,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                      );
                                      if (confirm == true && context.mounted) {
                                        unawaited(
                                          context
                                              .read<SecurityCubit>()
                                              .revokeSession(s.id),
                                        );
                                      }
                                    },
                                  ),
                              ],
                            ),
                          );
                        }),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildCard({required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: child,
    );
  }
}
