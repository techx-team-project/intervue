import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/profile_cubit.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/profile_identity.dart';

class IntervueGlassDrawer extends StatefulWidget {
  const IntervueGlassDrawer({
    this.onSelectTab,
    this.onMockInterviewTap,
    this.onCvScoreTap,
    this.onSavedJobsTap,
    super.key,
  });

  final ValueChanged<int>? onSelectTab;
  final VoidCallback? onMockInterviewTap;
  final VoidCallback? onCvScoreTap;
  final VoidCallback? onSavedJobsTap;

  @override
  State<IntervueGlassDrawer> createState() => _IntervueGlassDrawerState();
}

class _IntervueGlassDrawerState extends State<IntervueGlassDrawer> {
  bool _isJobSeeking = true;

  @override
  Widget build(BuildContext context) {
    final isAuthenticated =
        context.watch<AuthBloc>().state is AuthAuthenticated;
    return Drawer(
      backgroundColor: Colors.transparent,
      elevation: 0,
      width: 320,
      child: Stack(
        children: [
          // Frosted Glass Blur Background
          ClipRRect(
            borderRadius: const BorderRadius.horizontal(
              right: Radius.circular(28),
            ),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 24, sigmaY: 24),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.88),
                  borderRadius: const BorderRadius.horizontal(
                    right: Radius.circular(28),
                  ),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.7),
                    width: 1.5,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF003820).withValues(alpha: 0.12),
                      blurRadius: 30,
                      offset: const Offset(8, 0),
                    ),
                  ],
                ),
                child: SafeArea(
                  child: Column(
                    children: [
                      // Header & User Profile
                      _buildHeader(context),

                      const SizedBox(height: 8),

                      // Scrollable Navigation Items
                      Expanded(
                        child: ListView(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 16,
                            vertical: 8,
                          ),
                          children: [
                            if (!isAuthenticated) ...[
                              _buildGlassTile(
                                icon: Icons.login_rounded,
                                iconColor: AppColors.primary,
                                iconBg: AppColors.primaryLight,
                                title: 'Đăng nhập / Đăng ký',
                                subtitle:
                                    'Mở khóa chấm CV, lưu việc làm & thông báo',
                                onTap: () {
                                  Navigator.pop(context);
                                  context.push(RouteNames.login);
                                },
                              ),
                              const SizedBox(height: 14),
                            ],
                            if (isAuthenticated) ...[
                              // Section: AI Superpowers
                              _buildSectionTitle('TRỢ LÝ AI INTERVUE'),
                              _buildGlassTile(
                                icon: Icons.smart_toy_rounded,
                                iconColor: AppColors.accentPurple,
                                iconBg: AppColors.accentPurpleLight,
                                title: 'Luyện Phỏng Vấn AI',
                                subtitle: 'Phỏng vấn 1:1 theo JD bằng AI',
                                badge: 'HOT',
                                onTap: () {
                                  Navigator.pop(context);
                                  widget.onMockInterviewTap?.call();
                                },
                              ),
                              _buildGlassTile(
                                icon: Icons.document_scanner_rounded,
                                iconColor: AppColors.primary,
                                iconBg: AppColors.primaryLight,
                                title: 'AI Chấm Điểm CV',
                                subtitle: 'So khớp chuẩn ATS & đề xuất sửa',
                                badge: 'AI',
                                onTap: () {
                                  Navigator.pop(context);
                                  widget.onCvScoreTap?.call();
                                },
                              ),

                              const SizedBox(height: 14),
                            ],

                            // Section: Career Management
                            _buildSectionTitle('QUẢN LÝ VIỆC LÀM'),
                            if (isAuthenticated)
                              _buildGlassTile(
                                icon: Icons.bookmark_rounded,
                                iconColor: AppColors.accentOrange,
                                iconBg: AppColors.accentOrangeLight,
                                title: 'Việc Làm Đã Lưu',
                                subtitle: 'Theo dõi tin đã đánh dấu',
                                onTap: () {
                                  Navigator.pop(context);
                                  widget.onSavedJobsTap?.call();
                                },
                              ),
                            _buildGlassTile(
                              icon: Icons.work_outline_rounded,
                              iconColor: AppColors.accentBlue,
                              iconBg: AppColors.accentBlueLight,
                              title: 'Khám Phá Việc Làm',
                              subtitle: 'Tìm kiếm hàng ngàn cơ hội mới',
                              onTap: () {
                                Navigator.pop(context);
                                widget.onSelectTab?.call(1);
                              },
                            ),
                            _buildGlassTile(
                              icon: Icons.description_outlined,
                              iconColor: AppColors.primaryDark,
                              iconBg: AppColors.primaryLight,
                              title: 'Tạo CV Chuyên Nghiệp',
                              subtitle: 'Kho mẫu CV chuẩn TopCV/ATS',
                              onTap: () {
                                Navigator.pop(context);
                                widget.onSelectTab?.call(2);
                              },
                            ),

                            const SizedBox(height: 14),

                            // Section: Utility & Settings
                            _buildSectionTitle('TIỆN ÍCH & HỆ THỐNG'),
                            _buildGlassTile(
                              icon: Icons.smart_toy_rounded,
                              iconColor: AppColors.primary,
                              iconBg: const Color(0xFFE6F4EA),
                              title: 'Trợ Lý InterVue Bot AI',
                              subtitle: 'Tư vấn CV, phỏng vấn giả lập & lương',
                              badge: 'HOT AI',
                              onTap: () {
                                Navigator.pop(context);
                                context.push(RouteNames.aiChat);
                              },
                            ),
                            if (isAuthenticated)
                              _buildGlassTile(
                                icon: Icons.stars_rounded,
                                iconColor: const Color(0xFFD97706),
                                iconBg: const Color(0xFFFEF3C7),
                                title: 'Nâng Cấp Tài Khoản VIP',
                                subtitle:
                                    'Gói Pro & Premium - Mở khóa đặc quyền',
                                badge: 'VIP',
                                onTap: () {
                                  Navigator.pop(context);
                                  context.push(RouteNames.upgrade);
                                },
                              ),
                            _buildGlassTile(
                              icon: Icons.calculate_outlined,
                              iconColor: const Color(0xFF0F766E),
                              iconBg: const Color(0xFFCCFBF1),
                              title: 'Tính Lương Gross - Net',
                              subtitle: 'Chuẩn quy định bảo hiểm 2026',
                              onTap: () {
                                Navigator.pop(context);
                              },
                            ),
                            if (isAuthenticated)
                              _buildGlassTile(
                                icon: Icons.settings_outlined,
                                iconColor: AppColors.textSecondary,
                                iconBg: AppColors.borderSubtle,
                                title: 'Cài Đặt Tài Khoản',
                                subtitle: 'Bảo mật, thông báo & hồ sơ',
                                onTap: () {
                                  Navigator.pop(context);
                                  widget.onSelectTab?.call(4);
                                },
                              ),
                          ],
                        ),
                      ),

                      // Footer with app version & logout
                      _buildFooter(context),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    final identity = ProfileIdentity.resolve(
      isAuthenticated: context.watch<AuthBloc>().state is AuthAuthenticated,
      profile: context.watch<ProfileCubit>().state,
    );
    return Container(
      padding: const EdgeInsets.fromLTRB(18, 14, 14, 14),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.65),
        border: Border(
          bottom: BorderSide(
            color: Colors.white.withValues(alpha: 0.8),
            width: 1.2,
          ),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Row: Logo & Close Button
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Image.asset(
                'assets/images/intervue-logo.png',
                height: 24,
                fit: BoxFit.contain,
                errorBuilder: (context, error, stackTrace) => const Text(
                  'InterVue',
                  style: TextStyle(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w900,
                    fontSize: 18,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close_rounded, size: 20),
                color: AppColors.textSecondary,
                onPressed: () => Navigator.pop(context),
                visualDensity: VisualDensity.compact,
                splashRadius: 18,
              ),
            ],
          ),

          const SizedBox(height: 12),

          // User Info Glass Card
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppColors.primaryLight.withValues(alpha: 0.9),
                  Colors.white.withValues(alpha: 0.85),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                color: AppColors.primary.withValues(alpha: 0.25),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: AppColors.primary.withValues(alpha: 0.08),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                // Avatar with online status
                Stack(
                  children: [
                    CircleAvatar(
                      radius: 24,
                      backgroundColor: AppColors.primary.withValues(alpha: 0.2),
                      child: Text(
                        identity.initials,
                        style: const TextStyle(
                          color: AppColors.primaryDarker,
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
                    ),
                    if (!identity.isGuest)
                      Positioned(
                        right: 0,
                        bottom: 0,
                        child: Container(
                          width: 12,
                          height: 12,
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 2),
                          ),
                        ),
                      ),
                  ],
                ),

                const SizedBox(width: 12),

                // Name & Role
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        identity.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 14.5,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        identity.subtitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 10),

          // Job Seeking Switch Pill
          if (!identity.isGuest)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.75),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.white.withValues(alpha: 0.8)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.bolt_rounded,
                        size: 16,
                        color: _isJobSeeking
                            ? AppColors.primary
                            : AppColors.textMuted,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        _isJobSeeking
                            ? 'Đang bật tìm việc'
                            : 'Đang tắt tìm việc',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: _isJobSeeking
                              ? AppColors.primaryDarker
                              : AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                  Transform.scale(
                    scale: 0.75,
                    child: Switch(
                      value: _isJobSeeking,
                      activeTrackColor: AppColors.primary,
                      onChanged: (val) => setState(() => _isJobSeeking = val),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 6, bottom: 6, top: 4),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 10.5,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.8,
          color: AppColors.textMuted,
        ),
      ),
    );
  }

  Widget _buildGlassTile({
    required IconData icon,
    required Color iconColor,
    required Color iconBg,
    required String title,
    required String subtitle,
    String? badge,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.65),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.8),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(14),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: iconBg,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: iconColor, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Flexible(
                            child: Text(
                              title,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textPrimary,
                              ),
                            ),
                          ),
                          if (badge != null) ...[
                            const SizedBox(width: 6),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 5,
                                vertical: 1.5,
                              ),
                              decoration: BoxDecoration(
                                color: badge == 'HOT'
                                    ? AppColors.badgeUrgent
                                    : AppColors.primary,
                                borderRadius: BorderRadius.circular(5),
                              ),
                              child: Text(
                                badge,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 8.5,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(
                  Icons.chevron_right_rounded,
                  size: 18,
                  color: AppColors.textMuted,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFooter(BuildContext context) {
    final isAuthenticated =
        context.watch<AuthBloc>().state is AuthAuthenticated;
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 12),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.65),
        border: Border(
          top: BorderSide(color: Colors.white.withValues(alpha: 0.8), width: 1),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            'InterVue v1.0 • AI-HR Tech',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w500,
              color: AppColors.textMuted,
            ),
          ),
          if (isAuthenticated)
            InkWell(
              onTap: () {
                Navigator.pop(context);
                context.read<AuthBloc>().add(const AuthSignedOut());
              },
              borderRadius: BorderRadius.circular(8),
              child: const Padding(
                padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                child: Row(
                  children: [
                    Icon(
                      Icons.logout_rounded,
                      size: 15,
                      color: AppColors.error,
                    ),
                    SizedBox(width: 4),
                    Text(
                      'Đăng xuất',
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w600,
                        color: AppColors.error,
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
