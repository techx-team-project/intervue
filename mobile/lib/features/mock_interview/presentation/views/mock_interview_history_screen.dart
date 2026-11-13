import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/utils/formatters.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_summary.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/controllers/mock_interview_history_cubit.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/widgets/mock_interview_score.dart';

class MockInterviewHistoryScreen extends StatefulWidget {
  const MockInterviewHistoryScreen({super.key});

  @override
  State<MockInterviewHistoryScreen> createState() =>
      _MockInterviewHistoryScreenState();
}

class _MockInterviewHistoryScreenState
    extends State<MockInterviewHistoryScreen> {
  @override
  void initState() {
    super.initState();
    context.read<MockInterviewHistoryCubit>().load();
  }

  Future<void> _open(String route) async {
    await context.push<void>(route);
    if (mounted) {
      await context.read<MockInterviewHistoryCubit>().load(isRefresh: true);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'AI Mock Interview',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        elevation: 0,
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        centerTitle: true,
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _open(RouteNames.mockInterviewNew),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.auto_awesome),
        label: const Text(
          'New Interview',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
      body: BlocBuilder<MockInterviewHistoryCubit, MockInterviewHistoryState>(
        builder: (context, state) => switch (state) {
          MockInterviewHistoryLoading() => const Center(
            child: CircularProgressIndicator(),
          ),
          MockInterviewHistoryError(:final message) => _ErrorView(
            message: message,
            onRetry: () => context.read<MockInterviewHistoryCubit>().load(),
          ),
          MockInterviewHistoryLoaded(:final sessions) =>
            sessions.isEmpty
                ? _EmptyView(onStart: () => _open(RouteNames.mockInterviewNew))
                : RefreshIndicator(
                    onRefresh: () => context
                        .read<MockInterviewHistoryCubit>()
                        .load(isRefresh: true),
                    child: ListView.separated(
                      padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
                      itemCount: sessions.length + 1,
                      separatorBuilder: (_, _) => const SizedBox(height: 12),
                      itemBuilder: (context, index) => index == 0
                          ? Text(
                              'Saved Interview History (${sessions.length})',
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: AppColors.textPrimary,
                              ),
                            )
                          : _SessionCard(
                              session: sessions[index - 1],
                              onTap: () => _open(
                                RouteNames.mockInterview(
                                  sessions[index - 1].id,
                                ),
                              ),
                            ),
                    ),
                  ),
        },
      ),
    );
  }
}

class _SessionCard extends StatelessWidget {
  const _SessionCard({required this.session, required this.onTap});

  final MockInterviewSummary session;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final createdAt = session.createdAt;
    final score = session.overallScore;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.border),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    session.targetRole,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: AppColors.textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    children: [
                      _Tag(
                        session.seniorityLevel,
                        AppColors.chipBackground,
                        AppColors.textSecondary,
                      ),
                      _Tag(
                        session.focusArea.label,
                        AppColors.primaryLight,
                        AppColors.primaryDarker,
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    [
                      if (createdAt != null) Formatters.date(createdAt),
                      '${session.questionCount} questions',
                    ].join(' • '),
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textMuted,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    session.isCompleted
                        ? 'Completed'
                        : 'In Progress (${session.currentQuestionIndex}/${session.questionCount})',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: session.isCompleted
                          ? AppColors.success
                          : const Color(0xFFB45309),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                if (session.isCompleted && score != null)
                  MockInterviewScoreChip(score: score),
                const SizedBox(height: 8),
                Text(
                  session.isCompleted ? 'View Report' : 'Continue',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _Tag extends StatelessWidget {
  const _Tag(this.text, this.background, this.foreground);

  final String text;
  final Color background;
  final Color foreground;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        text,
        style: TextStyle(
          fontSize: 11,
          fontWeight: FontWeight.w600,
          color: foreground,
        ),
      ),
    );
  }
}

class _EmptyView extends StatelessWidget {
  const _EmptyView({required this.onStart});

  final VoidCallback onStart;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: AppColors.primaryLight,
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Icon(
                Icons.record_voice_over_rounded,
                color: AppColors.primary,
                size: 28,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'No mock interviews yet',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Start your first AI mock interview tailored to your resume to assess your knowledge and receive in-depth feedback.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                height: 1.5,
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 20),
            FilledButton.icon(
              onPressed: onStart,
              icon: const Icon(Icons.auto_awesome),
              label: const Text('Start Mock Interview Now'),
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  const _ErrorView({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.error_outline_rounded,
              size: 40,
              color: AppColors.error,
            ),
            const SizedBox(height: 12),
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 16),
            OutlinedButton(onPressed: onRetry, child: const Text('Try Again')),
          ],
        ),
      ),
    );
  }
}
