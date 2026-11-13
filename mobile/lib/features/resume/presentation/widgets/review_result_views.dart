import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/features/resume/data/models/cv_review.dart';

Color _scoreColor(int score) {
  if (score >= 80) return AppColors.success;
  if (score >= 60) return AppColors.star;
  return AppColors.error;
}

class _ScoreRing extends StatelessWidget {
  const _ScoreRing({required this.score, this.suffix = ''});

  final int score;
  final String suffix;

  @override
  Widget build(BuildContext context) {
    final color = _scoreColor(score);
    return SizedBox(
      width: 84,
      height: 84,
      child: Stack(
        alignment: Alignment.center,
        children: [
          SizedBox.expand(
            child: CircularProgressIndicator(
              value: score.clamp(0, 100) / 100,
              strokeWidth: 8,
              color: color,
              backgroundColor: AppColors.chipBackground,
            ),
          ),
          Text(
            '$score$suffix',
            style: TextStyle(
              fontSize: suffix.isEmpty ? 26 : 20,
              fontWeight: FontWeight.w900,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

class _Section extends StatelessWidget {
  const _Section({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
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

class _Heading extends StatelessWidget {
  const _Heading(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 15,
        color: AppColors.textPrimary,
      ),
    );
  }
}

class _CaptionLabel extends StatelessWidget {
  const _CaptionLabel(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 10.5,
        fontWeight: FontWeight.bold,
        letterSpacing: 0.6,
        color: AppColors.textMuted,
      ),
    );
  }
}

class CommentList extends StatelessWidget {
  const CommentList({required this.comments, super.key});

  final List<CvReviewComment> comments;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: comments.map((c) => _CommentCard(comment: c)).toList(),
    );
  }
}

class AtsReviewReport extends StatelessWidget {
  const AtsReviewReport({
    required this.review,
    required this.onReset,
    super.key,
  });

  final CvReview review;
  final VoidCallback onReset;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _Section(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _CaptionLabel(
                '${review.fromCache ? 'SAVED RESULT' : 'NEW AI REVIEW'}'
                '${review.modelVersion.isEmpty ? '' : ' · ${review.modelVersion}'}',
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  _ScoreRing(score: review.overallScore),
                  const SizedBox(width: 16),
                  const Expanded(child: _Heading('ATS review report')),
                ],
              ),
              const SizedBox(height: 14),
              const _CaptionLabel('SUMMARY'),
              const SizedBox(height: 4),
              Text(
                review.summary,
                style: const TextStyle(
                  fontSize: 13,
                  height: 1.5,
                  color: AppColors.textPrimary,
                ),
              ),
              if (review.fromCache) ...[
                const SizedBox(height: 8),
                const Text(
                  'Your CV has not changed, so the saved result is reused and no review is deducted.',
                  style: TextStyle(fontSize: 11.5, color: AppColors.textMuted),
                ),
              ],
            ],
          ),
        ),
        Row(
          children: [
            const Expanded(child: _Heading('Specific feedback')),
            Text(
              '${review.comments.length} comments',
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        CommentList(comments: review.comments),
        _ReviewAgainButton(onReset: onReset),
      ],
    );
  }
}

class JobFitReport extends StatefulWidget {
  const JobFitReport({
    required this.review,
    required this.onReset,
    required this.onOpenCreditHistory,
    super.key,
  });

  final CvReview review;
  final VoidCallback onReset;
  final VoidCallback onOpenCreditHistory;

  @override
  State<JobFitReport> createState() => _JobFitReportState();
}

class _JobFitReportState extends State<JobFitReport> {
  static const List<String> _fallbackStrengths = [
    'Relevant professional experience for the role',
    'Core technical skills are aligned',
    'Solid educational background',
  ];
  static const List<String> _fallbackGaps = [
    'Add measurable results to your achievements',
    'Clarify projects related to the requirements',
    'State your personal role clearly',
  ];
  static const List<String> _fallbackTips = [
    'Add keywords from the job description to your summary',
    'Use the STAR model for your key projects',
    'Check that fonts and layout are ATS friendly',
  ];
  static const Map<String, String> _statusLabels = {
    'MATCH': 'Meets requirement',
    'PARTIAL': 'Partially meets',
    'MISSING': 'Not met',
  };

  String _filter = 'ALL';
  bool _showComments = false;

  @override
  Widget build(BuildContext context) {
    final review = widget.review;
    final fitScore = review.jobFitScore ?? review.overallScore;
    final matches = review.requirementMatches;
    final visible = matches
        .where((m) => _filter == 'ALL' || m.status == _filter)
        .toList();
    int countOf(String status) =>
        matches.where((m) => m.status == status).length;
    final filters = <(String, String, int)>[
      ('ALL', 'All', matches.length),
      ('MATCH', 'Met', countOf('MATCH')),
      ('PARTIAL', 'Partial', countOf('PARTIAL')),
      ('MISSING', 'Not met', countOf('MISSING')),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _Section(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const _CaptionLabel('LEVEL 3 · JOB MATCH'),
              const SizedBox(height: 10),
              Row(
                children: [
                  _ScoreRing(score: fitScore, suffix: '%'),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _Heading(review.jobTitle ?? 'Target job'),
                        if (review.companyName != null)
                          Text(
                            review.companyName!,
                            style: const TextStyle(
                              fontSize: 12.5,
                              color: AppColors.textSecondary,
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                '${review.fromCache ? 'Loaded from cache, no credit used.' : 'Charged ${review.chargedCredits ?? 1} credit.'} '
                'A failed AI run is refunded automatically.',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.textSecondary,
                  height: 1.4,
                ),
              ),
              TextButton(
                onPressed: widget.onOpenCreditHistory,
                style: TextButton.styleFrom(
                  padding: EdgeInsets.zero,
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: const Text('View credit history'),
              ),
              const SizedBox(height: 10),
              const _CaptionLabel('SUMMARY'),
              const SizedBox(height: 4),
              Text(
                review.summary,
                style: const TextStyle(
                  fontSize: 13,
                  height: 1.5,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
        ),
        _InsightList(
          title: 'Top strengths',
          items: review.keyStrengths.isEmpty
              ? _fallbackStrengths
              : review.keyStrengths,
        ),
        _InsightList(
          title: 'Gaps to fix',
          items: review.gapAnalysis.isEmpty
              ? _fallbackGaps
              : review.gapAnalysis,
        ),
        _InsightList(
          title: 'Tips before applying',
          items: review.tailoringTips.isEmpty
              ? _fallbackTips
              : review.tailoringTips,
        ),
        _Section(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const _Heading('Requirement by requirement'),
              const SizedBox(height: 2),
              const Text(
                'Each requirement of the job post compared with evidence found in your CV.',
                style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: filters
                    .map(
                      (f) => ChoiceChip(
                        label: Text('${f.$2} (${f.$3})'),
                        selected: _filter == f.$1,
                        onSelected: (_) => setState(() => _filter = f.$1),
                      ),
                    )
                    .toList(),
              ),
              const SizedBox(height: 12),
              if (visible.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 16),
                  child: Center(
                    child: Text(
                      'No requirements in this filter.',
                      style: TextStyle(color: AppColors.textSecondary),
                    ),
                  ),
                ),
              ...visible.map(
                (m) => _RequirementCard(
                  match: m,
                  statusLabel: _statusLabels[m.status] ?? m.status,
                ),
              ),
            ],
          ),
        ),
        if (review.comments.isNotEmpty)
          _Section(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                InkWell(
                  onTap: () => setState(() => _showComments = !_showComments),
                  child: Row(
                    children: [
                      Expanded(
                        child: _Heading(
                          'Specific feedback (${review.comments.length})',
                        ),
                      ),
                      Icon(
                        _showComments
                            ? Icons.expand_less_rounded
                            : Icons.expand_more_rounded,
                        color: AppColors.textMuted,
                      ),
                    ],
                  ),
                ),
                if (_showComments) ...[
                  const SizedBox(height: 8),
                  CommentList(comments: review.comments),
                ],
              ],
            ),
          ),
        _ReviewAgainButton(onReset: widget.onReset),
      ],
    );
  }
}

class _InsightList extends StatelessWidget {
  const _InsightList({required this.title, required this.items});

  final String title;
  final List<String> items;

  @override
  Widget build(BuildContext context) {
    return _Section(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _Heading(title),
          const SizedBox(height: 10),
          for (var i = 0; i < items.length; i++)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  CircleAvatar(
                    radius: 9,
                    backgroundColor: AppColors.chipBackground,
                    child: Text(
                      '${i + 1}',
                      style: const TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      items[i],
                      style: const TextStyle(
                        fontSize: 13,
                        height: 1.45,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class _RequirementCard extends StatelessWidget {
  const _RequirementCard({required this.match, required this.statusLabel});

  final JobRequirementMatch match;
  final String statusLabel;

  Color get _statusColor => switch (match.status) {
    'MATCH' => AppColors.success,
    'PARTIAL' => AppColors.star,
    _ => AppColors.error,
  };

  @override
  Widget build(BuildContext context) {
    final evidence = match.cvEvidence.trim();
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            match.requirement,
            style: const TextStyle(
              fontSize: 13.5,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: _statusColor.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  statusLabel,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: _statusColor,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '${match.fitScore}%',
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          const _CaptionLabel('EVIDENCE IN YOUR CV'),
          const SizedBox(height: 2),
          Text(
            evidence.isEmpty ? 'No evidence found in your CV.' : '“$evidence”',
            style: const TextStyle(
              fontSize: 12.5,
              fontStyle: FontStyle.italic,
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 8),
          const _CaptionLabel('ANALYSIS'),
          const SizedBox(height: 2),
          Text(
            match.explanation,
            style: const TextStyle(
              fontSize: 12.5,
              height: 1.4,
              color: AppColors.textPrimary,
            ),
          ),
          if (match.improvementTip.isNotEmpty) ...[
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.primaryLight,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text.rich(
                TextSpan(
                  children: [
                    const TextSpan(
                      text: 'How to improve: ',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.primaryDark,
                      ),
                    ),
                    TextSpan(text: match.improvementTip),
                  ],
                ),
                style: const TextStyle(
                  fontSize: 12.5,
                  height: 1.4,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _ReviewAgainButton extends StatelessWidget {
  const _ReviewAgainButton({required this.onReset});

  final VoidCallback onReset;

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.centerRight,
      child: OutlinedButton.icon(
        onPressed: onReset,
        icon: const Icon(Icons.restart_alt_rounded),
        label: const Text('Review again'),
      ),
    );
  }
}

class _CommentCard extends StatelessWidget {
  const _CommentCard({required this.comment});

  final CvReviewComment comment;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: AppColors.accentOrangeLight,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(
              comment.section,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: AppColors.accentOrange,
              ),
            ),
          ),
          if (comment.quote.isNotEmpty) ...[
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(8),
                border: const Border(
                  left: BorderSide(color: AppColors.textMuted, width: 3),
                ),
              ),
              child: Text(
                '“${comment.quote}”',
                style: const TextStyle(
                  fontSize: 12.5,
                  fontStyle: FontStyle.italic,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          ],
          const SizedBox(height: 8),
          _LabeledLine(
            icon: Icons.warning_amber_rounded,
            color: AppColors.error,
            label: 'Issue',
            text: comment.problem,
          ),
          const SizedBox(height: 6),
          _LabeledLine(
            icon: Icons.lightbulb_outline_rounded,
            color: AppColors.primaryDark,
            label: 'Suggested rewrite (STAR)',
            text: comment.fix,
          ),
        ],
      ),
    );
  }
}

class _LabeledLine extends StatelessWidget {
  const _LabeledLine({
    required this.icon,
    required this.color,
    required this.label,
    required this.text,
  });

  final IconData icon;
  final Color color;
  final String label;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16, color: color),
        const SizedBox(width: 6),
        Expanded(
          child: Text.rich(
            TextSpan(
              children: [
                TextSpan(
                  text: '$label: ',
                  style: TextStyle(fontWeight: FontWeight.bold, color: color),
                ),
                TextSpan(
                  text: text,
                  style: const TextStyle(color: AppColors.textPrimary),
                ),
              ],
            ),
            style: const TextStyle(fontSize: 12.5, height: 1.4),
          ),
        ),
      ],
    );
  }
}
