import 'dart:async';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/theme/liquid_glass_theme.dart';
import 'package:intervue_flutter/core/widgets/liquid_glass_card.dart';
import 'package:intervue_flutter/core/widgets/login_required_view.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_certification_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_education_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_experience_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_language_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_project_model.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_skill_model.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/candidate_profile_cubit.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/candidate_profile_state.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/profile_cubit.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/profile_identity.dart';
import 'package:intervue_flutter/features/profile/presentation/widgets/add_certification_dialog.dart';
import 'package:intervue_flutter/features/profile/presentation/widgets/add_education_dialog.dart';
import 'package:intervue_flutter/features/profile/presentation/widgets/add_experience_dialog.dart';
import 'package:intervue_flutter/features/profile/presentation/widgets/add_language_dialog.dart';
import 'package:intervue_flutter/features/profile/presentation/widgets/add_project_dialog.dart';
import 'package:intervue_flutter/features/profile/presentation/widgets/add_skill_dialog.dart';
import 'package:intervue_flutter/features/profile/presentation/widgets/edit_candidate_profile_sheet.dart';
import 'package:intl/intl.dart';

class TopCvProfileTab extends StatefulWidget {
  const TopCvProfileTab({super.key});

  @override
  State<TopCvProfileTab> createState() => _TopCvProfileTabState();
}

class _TopCvProfileTabState extends State<TopCvProfileTab> {
  bool _isJobSeeking = true;

  @override
  Widget build(BuildContext context) {
    final authState = context.watch<AuthBloc>().state;
    final isAuthenticated = authState is AuthAuthenticated;
    final identity = ProfileIdentity.resolve(
      isAuthenticated: isAuthenticated,
      profile: context.watch<ProfileCubit>().state,
    );
    final candidateProfileState = context.watch<CandidateProfileCubit>().state;
    final isJobSeeking = candidateProfileState is CandidateProfileLoaded
        ? candidateProfileState.profile.isActivelyLooking
        : _isJobSeeking;

    if (!isAuthenticated) {
      return Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: const Text(
            'My account',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
              color: AppColors.textPrimary,
            ),
          ),
        ),
        body: const LoginRequiredView(
          icon: Icons.person_outline_rounded,
          title: 'Please sign in',
          message: 'Sign in to manage your profile, score your CV with AI and receive InterVue notifications.',
        ),
      );
    }

    return BlocListener<CandidateProfileCubit, CandidateProfileState>(
      listener: (context, state) {
        if (state is CandidateProfileLoaded) {
          if (state.actionMessage != null) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.actionMessage!),
                backgroundColor: AppColors.primary,
              ),
            );
            context.read<CandidateProfileCubit>().clearAction();
          } else if (state.actionError != null) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.actionError!),
                backgroundColor: AppColors.error,
              ),
            );
            context.read<CandidateProfileCubit>().clearAction();
          }
        } else if (state is CandidateProfileError) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: AppColors.error,
            ),
          );
        }
      },
      child: Scaffold(
        backgroundColor: LiquidGlassTheme.glassCanvas,
        appBar: AppBar(
          title: const Text(
            'My account',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
              color: AppColors.textPrimary,
            ),
          ),
          actions: [
            IconButton(
              icon: const Icon(Icons.settings_outlined),
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Account settings')),
                );
              },
            ),
          ],
        ),
        body: LiquidGlassBackground(
          child: RefreshIndicator(
            onRefresh: () async {
              await context.read<CandidateProfileCubit>().loadProfile(
                silent: true,
              );
            },
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                if (candidateProfileState is CandidateProfileLoading)
                  const Padding(
                    padding: EdgeInsets.only(bottom: 12),
                    child: LinearProgressIndicator(
                      minHeight: 2,
                      color: AppColors.primary,
                    ),
                  ),
                // Profile Header Card
                LiquidGlassCard(
                  borderRadius: 20,
                  blur: 16,
                  padding: const EdgeInsets.all(16),
                  backgroundColor: Colors.white.withValues(alpha: 0.8),
                  borderColor: Colors.white.withValues(alpha: 0.9),
                  hasSheen: true,
                  child: Row(
                    children: [
                      // Avatar with tap to upload
                      InkWell(
                        borderRadius: BorderRadius.circular(28),
                        onTap: () async {
                          final loadedProfile =
                              candidateProfileState is CandidateProfileLoaded
                              ? candidateProfileState.profile
                              : null;
                          final hasAvatar =
                              loadedProfile?.avatarUrl != null &&
                              loadedProfile!.avatarUrl!.isNotEmpty;

                          await showModalBottomSheet<void>(
                            context: context,
                            shape: const RoundedRectangleBorder(
                              borderRadius: BorderRadius.vertical(
                                top: Radius.circular(16),
                              ),
                            ),
                            builder: (ctx) => SafeArea(
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  ListTile(
                                    leading: const Icon(
                                      Icons.photo_library_outlined,
                                      color: AppColors.primary,
                                    ),
                                    title: const Text('Upload new avatar'),
                                    onTap: () async {
                                      Navigator.pop(ctx);
                                      final result = await FilePicker.platform
                                          .pickFiles(type: FileType.image);
                                      if (result != null &&
                                          result.files.single.path != null &&
                                          context.mounted) {
                                        unawaited(
                                          context
                                              .read<CandidateProfileCubit>()
                                              .uploadAvatar(
                                                result.files.single.path!,
                                              ),
                                        );
                                      }
                                    },
                                  ),
                                  if (hasAvatar)
                                    ListTile(
                                      leading: const Icon(
                                        Icons.delete_outline,
                                        color: AppColors.error,
                                      ),
                                      title: const Text(
                                        'Remove avatar',
                                        style: TextStyle(
                                          color: AppColors.error,
                                        ),
                                      ),
                                      onTap: () {
                                        Navigator.pop(ctx);
                                        unawaited(
                                          context
                                              .read<CandidateProfileCubit>()
                                              .removeAvatar(),
                                        );
                                      },
                                    ),
                                ],
                              ),
                            ),
                          );
                        },
                        child: Stack(
                          children: [
                            Container(
                              width: 56,
                              height: 56,
                              decoration: BoxDecoration(
                                color: AppColors.primaryLight,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: AppColors.primary,
                                  width: 1.5,
                                ),
                                image:
                                    (candidateProfileState
                                            is CandidateProfileLoaded &&
                                        (candidateProfileState)
                                                .profile
                                                .avatarUrl !=
                                            null &&
                                        (candidateProfileState)
                                            .profile
                                            .avatarUrl!
                                            .isNotEmpty)
                                    ? DecorationImage(
                                        image: NetworkImage(
                                          (candidateProfileState)
                                              .profile
                                              .avatarUrl!,
                                        ),
                                        fit: BoxFit.cover,
                                      )
                                    : null,
                              ),
                              child:
                                  (candidateProfileState
                                          is CandidateProfileLoaded &&
                                      (candidateProfileState)
                                              .profile
                                              .avatarUrl !=
                                          null &&
                                      (candidateProfileState)
                                          .profile
                                          .avatarUrl!
                                          .isNotEmpty)
                                  ? null
                                  : Center(
                                      child: Text(
                                        identity.initials,
                                        style: const TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                          color: AppColors.primaryDarker,
                                        ),
                                      ),
                                    ),
                            ),
                            Positioned(
                              right: 0,
                              bottom: 0,
                              child: Container(
                                padding: const EdgeInsets.all(3),
                                decoration: const BoxDecoration(
                                  color: AppColors.primary,
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(
                                  Icons.camera_alt,
                                  size: 12,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    identity.name,
                                    style: const TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.textPrimary,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),
                            Text(
                              identity.subtitle,
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(
                          Icons.edit_outlined,
                          size: 20,
                          color: AppColors.primary,
                        ),
                        tooltip: 'Edit information',
                        onPressed: () {
                          if (candidateProfileState is CandidateProfileLoaded) {
                            EditCandidateProfileSheet.show(
                              context,
                              profile: candidateProfileState.profile,
                              onSave: (data) {
                                unawaited(
                                  context
                                      .read<CandidateProfileCubit>()
                                      .updateProfile(data),
                                );
                              },
                            );
                          }
                        },
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 14),

                // Open-to-work toggle card
                LiquidGlassCard(
                  borderRadius: 16,
                  blur: 14,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 12,
                  ),
                  backgroundColor: isJobSeeking
                      ? const Color(0xFFE8F8F0).withValues(alpha: 0.85)
                      : Colors.white.withValues(alpha: 0.72),
                  borderColor: isJobSeeking
                      ? AppColors.primary.withValues(alpha: 0.35)
                      : Colors.white.withValues(alpha: 0.9),
                  child: Row(
                    children: [
                      Icon(
                        isJobSeeking ? Icons.bolt : Icons.power_settings_new,
                        color: isJobSeeking ? AppColors.primary : Colors.grey,
                        size: 26,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              isJobSeeking
                                  ? 'Open to work: ON'
                                  : 'Open to work: OFF',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: isJobSeeking
                                    ? AppColors.primaryDarker
                                    : AppColors.textSecondary,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              isJobSeeking
                                  ? 'Let recruiters find you and send interview invitations'
                                  : 'Your profile is hidden from recruiters',
                              style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Switch.adaptive(
                        value: isJobSeeking,
                        activeTrackColor: AppColors.primary,
                        onChanged: (val) {
                          setState(() => _isJobSeeking = val);
                          unawaited(
                            context
                                .read<CandidateProfileCubit>()
                                .toggleJobSearchStatus(val),
                          );
                        },
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Candidate Portfolio Section (Experiences, Educations, Skills)
                _buildCandidatePortfolioSection(context, candidateProfileState),

                const SizedBox(height: 16),

                const SizedBox(height: 16),

                // VIP Upgrade Card
                Container(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.12),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    borderRadius: BorderRadius.circular(16),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(16),
                      onTap: () => context.push(RouteNames.upgrade),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [
                                    Color(0xFFF59E0B),
                                    Color(0xFFD97706),
                                  ],
                                ),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.stars_rounded,
                                color: Colors.white,
                                size: 26,
                              ),
                            ),
                            const SizedBox(width: 14),
                            const Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Flexible(
                                        child: Text(
                                          'InterVue VIP account',
                                          overflow: TextOverflow.ellipsis,
                                          style: TextStyle(
                                            fontSize: 15,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                      SizedBox(width: 6),
                                      Text(
                                        'PRO / PRE',
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.w900,
                                          color: Color(0xFFFBBF24),
                                        ),
                                      ),
                                    ],
                                  ),
                                  SizedBox(height: 3),
                                  Text(
                                    'Boost your profile, unlimited CVs & AI practice',
                                    style: TextStyle(
                                      fontSize: 11.5,
                                      color: Color(0xFF94A3B8),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.primary,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Text(
                                'Upgrade',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 12),

                // InterVue AI Bot Consultation Banner
                Container(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF064E3B), Color(0xFF047857)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF064E3B).withValues(alpha: 0.18),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Material(
                    color: Colors.transparent,
                    borderRadius: BorderRadius.circular(16),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(16),
                      onTap: () => context.push(RouteNames.aiChat),
                      child: Padding(
                        padding: const EdgeInsets.all(14),
                        child: Row(
                          children: [
                            Container(
                              width: 44,
                              height: 44,
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                              ),
                              child: ClipOval(
                                child: Image.asset(
                                  'assets/images/intervue-bot.png',
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            const Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Flexible(
                                        child: Text(
                                          'InterVue AI Assistant',
                                          overflow: TextOverflow.ellipsis,
                                          style: TextStyle(
                                            fontSize: 14.5,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                      SizedBox(width: 6),
                                      Icon(
                                        Icons.auto_awesome,
                                        color: Color(0xFF6EE7B7),
                                        size: 14,
                                      ),
                                    ],
                                  ),
                                  SizedBox(height: 3),
                                  Text(
                                    'ATS-ready CV advice, interview practice & job help',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: Color(0xFFA7F3D0),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 6,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Text(
                                'Chat now',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF064E3B),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 16),

                // Quick Management Items
                LiquidGlassCard(
                  borderRadius: 18,
                  blur: 16,
                  padding: EdgeInsets.zero,
                  backgroundColor: Colors.white.withValues(alpha: 0.8),
                  borderColor: Colors.white.withValues(alpha: 0.9),
                  child: Column(
                    children: [
                      _buildListTile(
                        icon: Icons.description_outlined,
                        iconColor: AppColors.primary,
                        title: 'AI CV scoring',
                        subtitle: 'Upload a PDF CV to get a score and feedback',
                        onTap: () => context.push(RouteNames.resume),
                      ),
                      Divider(
                        height: 1,
                        indent: 56,
                        color: Colors.white.withValues(alpha: 0.8),
                      ),
                      _buildListTile(
                        icon: Icons.work_history_outlined,
                        iconColor: AppColors.accentBlue,
                        title: 'Applied jobs',
                        subtitle: 'Track your application status',
                        onTap: () => context.push(RouteNames.applications),
                      ),
                      Divider(
                        height: 1,
                        indent: 56,
                        color: Colors.white.withValues(alpha: 0.8),
                      ),
                      _buildListTile(
                        icon: Icons.notifications_active_outlined,
                        iconColor: const Color(0xFF10B981),
                        title: 'Job alert settings',
                        subtitle: 'Get matching jobs suggested by email',
                        onTap: () => context.push(RouteNames.jobAlerts),
                      ),
                      Divider(
                        height: 1,
                        indent: 56,
                        color: Colors.white.withValues(alpha: 0.8),
                      ),
                      _buildListTile(
                        icon: Icons.bookmark_border_rounded,
                        iconColor: AppColors.accentOrange,
                        title: 'Saved jobs',
                        subtitle: 'Your favorite jobs',
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Saved jobs list')),
                          );
                        },
                      ),
                      Divider(
                        height: 1,
                        indent: 56,
                        color: Colors.white.withValues(alpha: 0.8),
                      ),
                      _buildListTile(
                        icon: Icons.calculate_outlined,
                        iconColor: AppColors.accentPurple,
                        title: 'Gross - Net salary calculator',
                        subtitle: 'Convert income under the 2025 social insurance law',
                        onTap: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                'Opening the Gross - Net salary calculator',
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 16),

                // Account Options
                LiquidGlassCard(
                  borderRadius: 18,
                  blur: 16,
                  padding: EdgeInsets.zero,
                  backgroundColor: Colors.white.withValues(alpha: 0.8),
                  borderColor: Colors.white.withValues(alpha: 0.9),
                  child: Column(
                    children: [
                      _buildListTile(
                        icon: Icons.person_outline,
                        iconColor: AppColors.primary,
                        title: 'Edit personal profile',
                        subtitle: 'Update career goals & contact info',
                        onTap: () {
                          if (candidateProfileState is CandidateProfileLoaded) {
                            EditCandidateProfileSheet.show(
                              context,
                              profile: candidateProfileState.profile,
                              onSave: (data) {
                                unawaited(
                                  context
                                      .read<CandidateProfileCubit>()
                                      .updateProfile(data),
                                );
                              },
                            );
                          }
                        },
                      ),
                      Divider(
                        height: 1,
                        indent: 56,
                        color: Colors.white.withValues(alpha: 0.8),
                      ),
                      _buildListTile(
                        icon: Icons.shield_outlined,
                        iconColor: const Color(0xFF0284C7),
                        title: 'Account security & 2FA',
                        subtitle: 'Change password, 2-step verification, manage sessions',
                        onTap: () => context.push(RouteNames.security),
                      ),
                      Divider(
                        height: 1,
                        indent: 56,
                        color: Colors.white.withValues(alpha: 0.8),
                      ),
                      _buildListTile(
                        icon: Icons.help_outline,
                        iconColor: AppColors.textSecondary,
                        title: 'Help & Feedback',
                        subtitle: 'Hotline: 1900 1234',
                        onTap: () {},
                      ),
                      Divider(
                        height: 1,
                        indent: 56,
                        color: Colors.white.withValues(alpha: 0.8),
                      ),
                      if (isAuthenticated)
                        _buildListTile(
                          icon: Icons.logout,
                          iconColor: AppColors.error,
                          title: 'Sign out',
                          subtitle: 'Sign out of the current account',
                          onTap: () {
                            context.read<AuthBloc>().add(const AuthSignedOut());
                          },
                        )
                      else
                        _buildListTile(
                          icon: Icons.login,
                          iconColor: AppColors.primary,
                          title: 'Sign in / Sign up',
                          subtitle: 'Get the full experience',
                          onTap: () => context.go(RouteNames.login),
                        ),
                    ],
                  ),
                ),

                const SizedBox(height: 18),

                // InterVue AI Mascot Bot Support Card
                Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(16),
                    onTap: () => context.push(RouteNames.aiChat),
                    child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFFE8F8F0), Color(0xFFF0FDF4)],
                        ),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: AppColors.primary.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          Image.asset(
                            'assets/images/intervue-bot.png',
                            width: 44,
                            height: 44,
                            fit: BoxFit.contain,
                            errorBuilder: (_, _, _) => const Icon(
                              Icons.smart_toy,
                              size: 36,
                              color: AppColors.primary,
                            ),
                          ),
                          const SizedBox(width: 12),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Need help from the InterVue AI assistant?',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.primaryDarker,
                                  ),
                                ),
                                SizedBox(height: 2),
                                Text(
                                  'Chat 24/7 for IT job suggestions and profile tips.',
                                  style: TextStyle(
                                    fontSize: 11,
                                    color: AppColors.textSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const Icon(
                            Icons.chevron_right,
                            size: 20,
                            color: AppColors.primary,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 20),
                const Center(
                  child: Text(
                    'InterVue AI • Leading IT recruitment platform (2026 edition)',
                    style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCandidatePortfolioSection(
    BuildContext context,
    CandidateProfileState state,
  ) {
    final profile = state is CandidateProfileLoaded ? state.profile : null;
    final experiences = profile?.experiences ?? const [];
    final educations = profile?.educations ?? const [];
    final skills = profile?.skills ?? const [];
    final projects = profile?.projects ?? const [];
    final certifications = profile?.certifications ?? const [];
    final languages = profile?.languages ?? const [];

    return LiquidGlassCard(
      borderRadius: 18,
      blur: 16,
      padding: EdgeInsets.zero,
      backgroundColor: Colors.white.withValues(alpha: 0.8),
      borderColor: Colors.white.withValues(alpha: 0.9),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(
                    Icons.badge_outlined,
                    color: AppColors.primary,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Personal profile',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Experience, education & skills visible to recruiters',
                        style: TextStyle(
                          fontSize: 11,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          _buildExperienceSubSection(context, experiences),
          const Divider(height: 1),
          _buildEducationSubSection(context, educations),
          const Divider(height: 1),
          _buildSkillsSubSection(context, skills),
          const Divider(height: 1),
          _buildProjectsSubSection(context, projects),
          const Divider(height: 1),
          _buildCertificationsSubSection(context, certifications),
          const Divider(height: 1),
          _buildLanguagesSubSection(context, languages),
        ],
      ),
    );
  }

  Widget _buildExperienceSubSection(
    BuildContext context,
    List<CandidateExperienceModel> experiences,
  ) {
    final dateFmt = DateFormat('MM/yyyy');

    return Padding(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.work_outline,
                size: 18,
                color: AppColors.primary,
              ),
              const SizedBox(width: 8),
              Text(
                'Work experience (${experiences.length})',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const Spacer(),
              TextButton.icon(
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                onPressed: () async {
                  final data = await AddExperienceDialog.show(context);
                  if (data != null && context.mounted) {
                    unawaited(
                      context.read<CandidateProfileCubit>().addExperience(data),
                    );
                  }
                },
                icon: const Icon(Icons.add, size: 16, color: AppColors.primary),
                label: const Text(
                  'Add',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (experiences.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: const Text(
                'No work experience yet. Tap "+ Add" to update your profile.',
                style: TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
            )
          else
            ...experiences.map((exp) {
              final startStr = dateFmt.format(exp.startDate);
              final endStr = exp.current
                  ? 'Present'
                  : (exp.endDate != null ? dateFmt.format(exp.endDate!) : '');
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            exp.title,
                            style: const TextStyle(
                              fontSize: 13.5,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            exp.companyName,
                            style: const TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w600,
                              color: AppColors.primary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '$startStr - $endStr',
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.textSecondary,
                            ),
                          ),
                          if (exp.description != null &&
                              exp.description!.isNotEmpty) ...[
                            const SizedBox(height: 4),
                            Text(
                              exp.description!,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 11.5,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(
                        Icons.delete_outline,
                        size: 18,
                        color: Colors.redAccent,
                      ),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () async {
                        final confirm = await showDialog<bool>(
                          context: context,
                          builder: (ctx) => AlertDialog(
                            title: const Text('Confirm deletion'),
                            content: Text(
                              'Are you sure you want to delete the experience at "${exp.companyName}"?',
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(ctx, false),
                                child: const Text('Cancel'),
                              ),
                              TextButton(
                                onPressed: () => Navigator.pop(ctx, true),
                                child: const Text(
                                  'Delete',
                                  style: TextStyle(color: AppColors.error),
                                ),
                              ),
                            ],
                          ),
                        );
                        if (confirm == true && context.mounted) {
                          unawaited(
                            context
                                .read<CandidateProfileCubit>()
                                .deleteExperience(exp.id),
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
    );
  }

  Widget _buildEducationSubSection(
    BuildContext context,
    List<CandidateEducationModel> educations,
  ) {
    return Padding(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.school_outlined,
                size: 18,
                color: AppColors.primary,
              ),
              const SizedBox(width: 8),
              Text(
                'Education & Degrees (${educations.length})',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const Spacer(),
              TextButton.icon(
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                onPressed: () async {
                  final data = await AddEducationDialog.show(context);
                  if (data != null && context.mounted) {
                    unawaited(
                      context.read<CandidateProfileCubit>().addEducation(data),
                    );
                  }
                },
                icon: const Icon(Icons.add, size: 16, color: AppColors.primary),
                label: const Text(
                  'Add',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (educations.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: const Text(
                'No education yet. Tap "+ Add" to update.',
                style: TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
            )
          else
            ...educations.map((edu) {
              final subtitle = [
                if (edu.degree != null && edu.degree!.isNotEmpty) edu.degree!,
                if (edu.major != null && edu.major!.isNotEmpty) edu.major!,
              ].join(' - ');
              final yearsStr = '${edu.startYear} - ${edu.endYear ?? 'Present'}';

              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            edu.school,
                            style: const TextStyle(
                              fontSize: 13.5,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          if (subtitle.isNotEmpty) ...[
                            const SizedBox(height: 2),
                            Text(
                              subtitle,
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppColors.primaryDarker,
                              ),
                            ),
                          ],
                          const SizedBox(height: 2),
                          Text(
                            yearsStr,
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(
                        Icons.delete_outline,
                        size: 18,
                        color: Colors.redAccent,
                      ),
                      padding: EdgeInsets.zero,
                      constraints: const BoxConstraints(),
                      onPressed: () async {
                        final confirm = await showDialog<bool>(
                          context: context,
                          builder: (ctx) => AlertDialog(
                            title: const Text('Confirm deletion'),
                            content: Text(
                              'Are you sure you want to delete the education at "${edu.school}"?',
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(ctx, false),
                                child: const Text('Cancel'),
                              ),
                              TextButton(
                                onPressed: () => Navigator.pop(ctx, true),
                                child: const Text(
                                  'Delete',
                                  style: TextStyle(color: AppColors.error),
                                ),
                              ),
                            ],
                          ),
                        );
                        if (confirm == true && context.mounted) {
                          unawaited(
                            context
                                .read<CandidateProfileCubit>()
                                .deleteEducation(edu.id),
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
    );
  }

  Widget _buildSkillsSubSection(
    BuildContext context,
    List<CandidateSkillModel> skills,
  ) {
    return Padding(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.psychology_outlined,
                size: 18,
                color: AppColors.primary,
              ),
              const SizedBox(width: 8),
              Text(
                'Professional skills (${skills.length})',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const Spacer(),
              TextButton.icon(
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                onPressed: () async {
                  final data = await AddSkillDialog.show(context);
                  if (data != null && context.mounted) {
                    unawaited(
                      context.read<CandidateProfileCubit>().addSkill(data),
                    );
                  }
                },
                icon: const Icon(Icons.add, size: 16, color: AppColors.primary),
                label: const Text(
                  'Add',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (skills.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: const Text(
                'No skills yet. Tap "+ Add" for more accurate AI matching.',
                style: TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
            )
          else
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: skills.map((skill) {
                return Chip(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  label: Text(
                    '${skill.name} • ${skill.levelLabelVi}',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primaryDarker,
                    ),
                  ),
                  backgroundColor: AppColors.primaryLight,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                    side: BorderSide(
                      color: AppColors.primary.withValues(alpha: 0.3),
                    ),
                  ),
                  deleteIcon: const Icon(
                    Icons.close,
                    size: 14,
                    color: AppColors.textSecondary,
                  ),
                  onDeleted: () async {
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('Confirm deletion'),
                        content: Text('Delete skill "${skill.name}"?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(ctx, false),
                            child: const Text('Cancel'),
                          ),
                          TextButton(
                            onPressed: () => Navigator.pop(ctx, true),
                            child: const Text(
                              'Delete',
                              style: TextStyle(color: AppColors.error),
                            ),
                          ),
                        ],
                      ),
                    );
                    if (confirm == true && context.mounted) {
                      unawaited(
                        context.read<CandidateProfileCubit>().deleteSkill(
                          skill.id,
                        ),
                      );
                    }
                  },
                );
              }).toList(),
            ),
        ],
      ),
    );
  }

  Widget _buildProjectsSubSection(
    BuildContext context,
    List<CandidateProjectModel> projects,
  ) {
    final dateFmt = DateFormat('MM/yyyy');

    return Padding(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.folder_special_outlined,
                size: 18,
                color: AppColors.primary,
              ),
              const SizedBox(width: 8),
              Text(
                'Featured projects (${projects.length})',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const Spacer(),
              TextButton.icon(
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                onPressed: () async {
                  final data = await AddProjectDialog.show(context);
                  if (data != null && context.mounted) {
                    unawaited(
                      context.read<CandidateProfileCubit>().addProject(data),
                    );
                  }
                },
                icon: const Icon(Icons.add, size: 16, color: AppColors.primary),
                label: const Text(
                  'Add',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (projects.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: const Text(
                'No projects yet. Tap "+ Add" to showcase your work.',
                style: TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
            )
          else
            ...projects.map((proj) {
              final startStr = dateFmt.format(proj.startDate);
              final endStr = proj.current
                  ? 'Present'
                  : (proj.endDate != null ? dateFmt.format(proj.endDate!) : '');
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            proj.name,
                            style: const TextStyle(
                              fontSize: 13.5,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          if (proj.role != null && proj.role!.isNotEmpty) ...[
                            const SizedBox(height: 2),
                            Text(
                              proj.role!,
                              style: const TextStyle(
                                fontSize: 12.5,
                                fontWeight: FontWeight.w600,
                                color: AppColors.primary,
                              ),
                            ),
                          ],
                          const SizedBox(height: 2),
                          Text(
                            '$startStr - $endStr',
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.textSecondary,
                            ),
                          ),
                          if (proj.technologies.isNotEmpty) ...[
                            const SizedBox(height: 6),
                            Wrap(
                              spacing: 4,
                              runSpacing: 4,
                              children: proj.technologies
                                  .map(
                                    (t) => Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 6,
                                        vertical: 2,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(4),
                                        border: Border.all(
                                          color: AppColors.border,
                                        ),
                                      ),
                                      child: Text(
                                        t,
                                        style: const TextStyle(
                                          fontSize: 10.5,
                                          color: AppColors.textSecondary,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ),
                                  )
                                  .toList(),
                            ),
                          ],
                          if (proj.description != null &&
                              proj.description!.isNotEmpty) ...[
                            const SizedBox(height: 4),
                            Text(
                              proj.description!,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 11.5,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(
                        Icons.delete_outline,
                        size: 18,
                        color: AppColors.textMuted,
                      ),
                      visualDensity: VisualDensity.compact,
                      onPressed: () async {
                        final confirm = await showDialog<bool>(
                          context: context,
                          builder: (ctx) => AlertDialog(
                            title: const Text('Confirm deletion'),
                            content: Text(
                              'Are you sure you want to delete the project "${proj.name}"?',
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(ctx, false),
                                child: const Text('Cancel'),
                              ),
                              TextButton(
                                onPressed: () => Navigator.pop(ctx, true),
                                child: const Text(
                                  'Delete',
                                  style: TextStyle(color: AppColors.error),
                                ),
                              ),
                            ],
                          ),
                        );
                        if (confirm == true && context.mounted) {
                          unawaited(
                            context.read<CandidateProfileCubit>().deleteProject(
                              proj.id,
                            ),
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
    );
  }

  Widget _buildCertificationsSubSection(
    BuildContext context,
    List<CandidateCertificationModel> certifications,
  ) {
    final dateFmt = DateFormat('MM/yyyy');

    return Padding(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.workspace_premium_outlined,
                size: 18,
                color: AppColors.primary,
              ),
              const SizedBox(width: 8),
              Text(
                'Certifications (${certifications.length})',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const Spacer(),
              TextButton.icon(
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                onPressed: () async {
                  final data = await AddCertificationDialog.show(context);
                  if (data != null && context.mounted) {
                    unawaited(
                      context.read<CandidateProfileCubit>().addCertification(
                        data,
                      ),
                    );
                  }
                },
                icon: const Icon(Icons.add, size: 16, color: AppColors.primary),
                label: const Text(
                  'Add',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (certifications.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: const Text(
                'No certifications yet. Tap "+ Add" to build trust.',
                style: TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
            )
          else
            ...certifications.map((cert) {
              final issueDateStr = cert.issueDate != null
                  ? dateFmt.format(cert.issueDate!)
                  : null;
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey.shade50,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            cert.name,
                            style: const TextStyle(
                              fontSize: 13.5,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            cert.issuer,
                            style: const TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w600,
                              color: AppColors.primary,
                            ),
                          ),
                          if (issueDateStr != null ||
                              cert.credentialId != null) ...[
                            const SizedBox(height: 2),
                            Text(
                              [
                                if (issueDateStr != null)
                                  'Issued: $issueDateStr',
                                if (cert.credentialId != null)
                                  'ID: ${cert.credentialId}',
                              ].join(' • '),
                              style: const TextStyle(
                                fontSize: 11,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(
                        Icons.delete_outline,
                        size: 18,
                        color: AppColors.textMuted,
                      ),
                      visualDensity: VisualDensity.compact,
                      onPressed: () async {
                        final confirm = await showDialog<bool>(
                          context: context,
                          builder: (ctx) => AlertDialog(
                            title: const Text('Confirm deletion'),
                            content: Text(
                              'Are you sure you want to delete the certification "${cert.name}"?',
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(ctx, false),
                                child: const Text('Cancel'),
                              ),
                              TextButton(
                                onPressed: () => Navigator.pop(ctx, true),
                                child: const Text(
                                  'Delete',
                                  style: TextStyle(color: AppColors.error),
                                ),
                              ),
                            ],
                          ),
                        );
                        if (confirm == true && context.mounted) {
                          unawaited(
                            context
                                .read<CandidateProfileCubit>()
                                .deleteCertification(cert.id),
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
    );
  }

  Widget _buildLanguagesSubSection(
    BuildContext context,
    List<CandidateLanguageModel> languages,
  ) {
    return Padding(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.translate_outlined,
                size: 18,
                color: AppColors.primary,
              ),
              const SizedBox(width: 8),
              Text(
                'Languages (${languages.length})',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const Spacer(),
              TextButton.icon(
                style: TextButton.styleFrom(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                onPressed: () async {
                  final data = await AddLanguageDialog.show(context);
                  if (data != null && context.mounted) {
                    unawaited(
                      context.read<CandidateProfileCubit>().addLanguage(data),
                    );
                  }
                },
                icon: const Icon(Icons.add, size: 16, color: AppColors.primary),
                label: const Text(
                  'Add',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (languages.isEmpty)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: const Text(
                'No languages yet. Tap "+ Add" to complete your profile.',
                style: TextStyle(fontSize: 12, color: AppColors.textMuted),
              ),
            )
          else
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: languages.map((lang) {
                final certStr =
                    lang.certificate != null && lang.certificate!.isNotEmpty
                    ? ' (${lang.certificate})'
                    : '';
                return Chip(
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  label: Text(
                    '${lang.language} • ${lang.proficiencyLabelVi}$certStr',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primaryDarker,
                    ),
                  ),
                  backgroundColor: AppColors.primaryLight,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                    side: BorderSide(
                      color: AppColors.primary.withValues(alpha: 0.3),
                    ),
                  ),
                  deleteIcon: const Icon(
                    Icons.close,
                    size: 14,
                    color: AppColors.textSecondary,
                  ),
                  onDeleted: () async {
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (ctx) => AlertDialog(
                        title: const Text('Confirm deletion'),
                        content: Text('Delete language "${lang.language}"?'),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(ctx, false),
                            child: const Text('Cancel'),
                          ),
                          TextButton(
                            onPressed: () => Navigator.pop(ctx, true),
                            child: const Text(
                              'Delete',
                              style: TextStyle(color: AppColors.error),
                            ),
                          ),
                        ],
                      ),
                    );
                    if (confirm == true && context.mounted) {
                      unawaited(
                        context.read<CandidateProfileCubit>().deleteLanguage(
                          lang.id,
                        ),
                      );
                    }
                  },
                );
              }).toList(),
            ),
        ],
      ),
    );
  }

  Widget _buildListTile({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Material(
      color: Colors.transparent,
      child: ListTile(
        leading: Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: iconColor.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        title: Text(
          title,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
        ),
        trailing: const Icon(
          Icons.chevron_right,
          size: 18,
          color: AppColors.textMuted,
        ),
        onTap: onTap,
      ),
    );
  }
}
