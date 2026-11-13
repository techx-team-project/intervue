import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_detail.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_question.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/widgets/mock_interview_score.dart';

class MockInterviewResultView extends StatelessWidget {
  const MockInterviewResultView({
    required this.session,
    required this.onStartNew,
    required this.onViewHistory,
    super.key,
  });

  final MockInterviewDetail session;
  final VoidCallback onStartNew;
  final VoidCallback onViewHistory;

  @override
  Widget build(BuildContext context) {
    final score = session.overallScore ?? 75;
    final tone = MockInterviewScoreTone.of(score);
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _Panel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '${session.targetRole} • ${session.seniorityLevel}',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primaryDarker,
                ),
              ),
              const SizedBox(height: 6),
              const Text(
                'AI Mock Interview Evaluation Report',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'You have completed all ${session.questionCount} realistic mock interview questions.',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                ),
              ),
              const SizedBox(height: 16),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  color: tone.background,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: tone.border),
                ),
                child: Column(
                  children: [
                    Text(
                      'OVERALL SCORE',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                        color: tone.foreground,
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.baseline,
                      textBaseline: TextBaseline.alphabetic,
                      children: [
                        Text(
                          '$score',
                          style: TextStyle(
                            fontSize: 40,
                            fontWeight: FontWeight.w900,
                            color: tone.foreground,
                          ),
                        ),
                        Text(
                          ' /100',
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: tone.foreground.withValues(alpha: 0.75),
                          ),
                        ),
                      ],
                    ),
                    Text(
                      tone.label,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: tone.foreground,
                      ),
                    ),
                  ],
                ),
              ),
              if (session.overallFeedback?.isNotEmpty ?? false) ...[
                const SizedBox(height: 16),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.background,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.borderSubtle),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(
                            Icons.auto_awesome,
                            size: 16,
                            color: AppColors.primary,
                          ),
                          SizedBox(width: 6),
                          Text(
                            'Executive Summary from AI Hiring Lead',
                            style: TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.bold,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text(
                        session.overallFeedback!,
                        style: const TextStyle(
                          fontSize: 12.5,
                          height: 1.6,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 12),
        _PointsPanel(
          title: 'Top 3 Key Strengths',
          icon: Icons.emoji_events_rounded,
          itemIcon: Icons.check_circle_rounded,
          accent: const Color(0xFF047857),
          background: const Color(0xFFECFDF5),
          border: const Color(0xFFA7F3D0),
          items: session.strengths.take(3).toList(),
          emptyText: 'No strengths data available',
        ),
        const SizedBox(height: 12),
        _PointsPanel(
          title: 'Top 3 Areas for Improvement',
          icon: Icons.trending_up_rounded,
          itemIcon: Icons.lightbulb_rounded,
          accent: const Color(0xFFB45309),
          background: const Color(0xFFFFFBEB),
          border: const Color(0xFFFDE68A),
          items: session.improvements.take(3).toList(),
          emptyText: 'No improvements data available',
        ),
        const SizedBox(height: 12),
        _Panel(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Question Breakdown & Feedback (${session.questions.length} questions)',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 4),
              ...session.questions.map(_QuestionBreakdown.new),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Row(
          children: [
            Expanded(
              child: OutlinedButton.icon(
                onPressed: onViewHistory,
                icon: const Icon(Icons.history_rounded),
                label: const Text('History'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: FilledButton.icon(
                onPressed: onStartNew,
                icon: const Icon(Icons.refresh_rounded),
                label: const Text('New Interview'),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _QuestionBreakdown extends StatelessWidget {
  const _QuestionBreakdown(this.question);

  final MockInterviewQuestion question;

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
      child: ExpansionTile(
        tilePadding: EdgeInsets.zero,
        childrenPadding: const EdgeInsets.only(bottom: 12),
        leading: CircleAvatar(
          radius: 12,
          backgroundColor: AppColors.chipBackground,
          child: Text(
            '${question.questionOrder}',
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: AppColors.textSecondary,
            ),
          ),
        ),
        title: Text(
          question.questionText,
          style: const TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Wrap(
            spacing: 8,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Text(
                question.category,
                style: const TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                  color: AppColors.textMuted,
                ),
              ),
              if (question.score != null)
                MockInterviewScoreChip(score: question.score!),
              if (question.followUpQuestion != null)
                const Text(
                  'Has follow-up',
                  style: TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFFB45309),
                  ),
                ),
            ],
          ),
        ),
        children: [
          _Block(
            icon: Icons.chat_bubble_outline_rounded,
            title: 'Your Answer',
            body: question.candidateAnswer ?? 'No answer submitted',
            background: AppColors.background,
            border: AppColors.borderSubtle,
          ),
          if (question.followUpQuestion != null)
            _Block(
              icon: Icons.help_outline_rounded,
              title: 'Follow-up Question',
              body: question.followUpAnswer == null
                  ? question.followUpQuestion!
                  : '${question.followUpQuestion!}\n\nFollow-up response: ${question.followUpAnswer!}',
              background: const Color(0xFFFFFBEB),
              border: const Color(0xFFFDE68A),
            ),
          if (question.feedback?.isNotEmpty ?? false)
            _Block(
              icon: Icons.auto_awesome,
              title: 'AI Assessment',
              body: question.feedback!,
              background: AppColors.primaryLight,
              border: const Color(0xFFBBF7D0),
            ),
          if (question.idealAnswer?.isNotEmpty ?? false)
            _Block(
              icon: Icons.lightbulb_outline_rounded,
              title: 'Model Answer / Recommendation',
              body: question.idealAnswer!,
              background: const Color(0xFFECFDF5),
              border: const Color(0xFFA7F3D0),
              italic: true,
            ),
        ],
      ),
    );
  }
}

class _Block extends StatelessWidget {
  const _Block({
    required this.icon,
    required this.title,
    required this.body,
    required this.background,
    required this.border,
    this.italic = false,
  });

  final IconData icon;
  final String title;
  final String body;
  final Color background;
  final Color border;
  final bool italic;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 14, color: AppColors.textSecondary),
              const SizedBox(width: 6),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            body,
            style: TextStyle(
              fontSize: 12.5,
              height: 1.5,
              fontStyle: italic ? FontStyle.italic : FontStyle.normal,
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}

class _PointsPanel extends StatelessWidget {
  const _PointsPanel({
    required this.title,
    required this.icon,
    required this.itemIcon,
    required this.accent,
    required this.background,
    required this.border,
    required this.items,
    required this.emptyText,
  });

  final String title;
  final IconData icon;
  final IconData itemIcon;
  final Color accent;
  final Color background;
  final Color border;
  final List<String> items;
  final String emptyText;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 18, color: accent),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: accent,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          if (items.isEmpty)
            Text(
              emptyText,
              style: const TextStyle(
                fontSize: 12,
                fontStyle: FontStyle.italic,
                color: AppColors.textMuted,
              ),
            )
          else
            ...items.map(
              (item) => Container(
                width: double.infinity,
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: border),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(itemIcon, size: 16, color: accent),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        item,
                        style: const TextStyle(
                          fontSize: 12.5,
                          height: 1.5,
                          fontWeight: FontWeight.w500,
                          color: AppColors.textPrimary,
                        ),
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

class _Panel extends StatelessWidget {
  const _Panel({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
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
