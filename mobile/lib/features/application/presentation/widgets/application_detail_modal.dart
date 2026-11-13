import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:intervue_flutter/core/di/injection_container.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/utils/file_helpers.dart';
import 'package:intervue_flutter/features/application/data/models/application_model.dart';
import 'package:intervue_flutter/features/application/data/repositories/application_repository_impl.dart';

class ApplicationDetailModal extends StatefulWidget {
  const ApplicationDetailModal({
    required this.applicationId,
    this.onStatusChanged,
    super.key,
  });

  final int applicationId;
  final VoidCallback? onStatusChanged;

  static Future<void> show(
    BuildContext context, {
    required int applicationId,
    VoidCallback? onStatusChanged,
  }) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => ApplicationDetailModal(
        applicationId: applicationId,
        onStatusChanged: onStatusChanged,
      ),
    );
  }

  @override
  State<ApplicationDetailModal> createState() => _ApplicationDetailModalState();
}

class _ApplicationDetailModalState extends State<ApplicationDetailModal> {
  bool _isLoading = true;
  String? _error;
  ApplicationModel? _detail;
  bool _isActionProcessing = false;

  @override
  void initState() {
    super.initState();
    _fetchDetail();
  }

  Future<void> _fetchDetail() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final repo = getIt<ApplicationRepositoryImpl>();
      final result = await repo.getDetail(widget.applicationId);
      if (mounted) {
        setState(() {
          _detail = result;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Unable to load application details: $e';
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _handleWithdraw() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Confirm withdrawal'),
        content: const Text(
          'Are you sure you want to withdraw this application? The recruiter will stop reviewing it.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: Colors.white,
            ),
            child: const Text('Withdraw'),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;

    setState(() => _isActionProcessing = true);
    try {
      final repo = getIt<ApplicationRepositoryImpl>();
      final updated = await repo.withdraw(widget.applicationId);
      if (mounted) {
        setState(() {
          _detail = updated;
          _isActionProcessing = false;
        });
        widget.onStatusChanged?.call();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Application withdrawn successfully'),
            backgroundColor: AppColors.primary,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isActionProcessing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Unable to withdraw the application: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.85,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (context, scrollController) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              _buildHeader(context),
              const Divider(height: 1),
              Expanded(
                child: _isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : _error != null
                    ? _buildErrorView()
                    : _buildDetailContent(scrollController),
              ),
              if (_detail != null && _detail!.canWithdraw)
                _buildBottomAction(context),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHeader(BuildContext context) {
    final title = _detail?.jobTitle ?? 'Application details';
    final company = _detail?.companyName ?? '';

    return Container(
      padding: const EdgeInsets.fromLTRB(20, 12, 12, 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 36,
              height: 4,
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: AppColors.border,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (company.isNotEmpty) ...[
                      const SizedBox(height: 2),
                      Text(
                        company,
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppColors.textSecondary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ],
                ),
              ),
              IconButton(
                onPressed: () => Navigator.of(context).pop(),
                icon: const Icon(Icons.close, color: AppColors.textMuted),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildErrorView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 48, color: AppColors.error),
            const SizedBox(height: 12),
            Text(
              _error ?? 'Unknown error',
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.textSecondary),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _fetchDetail,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
              ),
              child: const Text('Try again'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailContent(ScrollController scrollController) {
    final detail = _detail!;
    final dateFmt = DateFormat('dd/MM/yyyy HH:mm');

    return ListView(
      controller: scrollController,
      padding: const EdgeInsets.all(16),
      children: [
        // Status Card
        _buildStatusBanner(detail),
        const SizedBox(height: 16),

        // CV Snapshot
        _buildCvSection(detail),
        const SizedBox(height: 16),

        // Cover Letter
        if (detail.coverLetter != null && detail.coverLetter!.isNotEmpty) ...[
          _buildCoverLetterSection(detail.coverLetter!),
          const SizedBox(height: 16),
        ],

        // Screening Answers
        if (detail.answers.isNotEmpty) ...[
          _buildScreeningAnswersSection(detail.answers),
          const SizedBox(height: 16),
        ],

        // Timeline History
        if (detail.history.isNotEmpty) ...[
          _buildTimelineSection(detail.history, dateFmt),
          const SizedBox(height: 16),
        ],
      ],
    );
  }

  Widget _buildStatusBanner(ApplicationModel detail) {
    final label = switch (detail.status) {
      'APPLIED' => 'Applied',
      'VIEWED' => 'Viewed',
      'IN_REVIEW' => 'In review',
      'INTERVIEW' => 'Interview invited',
      'OFFER' => 'Offer',
      'HIRED' => 'Hired',
      'REJECTED' => 'Not a match',
      'WITHDRAWN' => 'Withdrawn',
      'JOB_CLOSED' => 'Job closed',
      _ => detail.status,
    };

    final color = switch (detail.status) {
      'APPLIED' => AppColors.accentBlue,
      'VIEWED' => AppColors.accentPurple,
      'IN_REVIEW' => AppColors.accentOrange,
      'INTERVIEW' => const Color(0xFF4F46E5),
      'OFFER' || 'HIRED' => AppColors.primary,
      'REJECTED' => AppColors.error,
      _ => AppColors.textMuted,
    };

    final bgColor = switch (detail.status) {
      'APPLIED' => AppColors.accentBlueLight,
      'VIEWED' => AppColors.accentPurpleLight,
      'IN_REVIEW' => AppColors.accentOrangeLight,
      'INTERVIEW' => const Color(0xFFEEF2FF),
      'OFFER' || 'HIRED' => AppColors.primaryLight,
      'REJECTED' => AppColors.badgeUrgentLight,
      _ => AppColors.chipBackground,
    };

    final dateFmt = DateFormat('dd/MM/yyyy HH:mm');

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Application status',
                style: TextStyle(
                  fontSize: 12,
                  color: color,
                  fontWeight: FontWeight.w600,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  label,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
          if (detail.submittedAt != null) ...[
            const SizedBox(height: 10),
            Text(
              'Submitted at: ${dateFmt.format(detail.submittedAt!.toLocal())}',
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
            ),
          ],
          if (detail.viewedAt != null) ...[
            const SizedBox(height: 4),
            Text(
              'Viewed by the recruiter at: ${dateFmt.format(detail.viewedAt!.toLocal())}',
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildCvSection(ApplicationModel detail) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'CV used to apply',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              const Icon(
                Icons.picture_as_pdf,
                color: AppColors.error,
                size: 28,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      detail.cv?.fileName ?? 'Saved CV',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (detail.cv != null) ...[
                      const SizedBox(height: 2),
                      Text(
                        FileHelpers.formatSize(detail.cv!.fileSizeBytes),
                        style: const TextStyle(
                          fontSize: 11,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCoverLetterSection(String coverLetter) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Cover letter',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            coverLetter,
            style: const TextStyle(
              fontSize: 13,
              color: AppColors.textSecondary,
              height: 1.4,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildScreeningAnswersSection(List<ApplicationAnswerModel> answers) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Your answers',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          ...answers.map((a) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    a.prompt ?? 'Question #${a.questionId}',
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.borderSubtle),
                    ),
                    child: Text(
                      a.answer,
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildTimelineSection(
    List<ApplicationHistoryModel> history,
    DateFormat dateFmt,
  ) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Status history',
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          ...history.map((entry) {
            final toLabel = switch (entry.to) {
              'APPLIED' => 'Application submitted',
              'VIEWED' => 'Viewed by the recruiter',
              'IN_REVIEW' => 'Under evaluation',
              'INTERVIEW' => 'Interview invited',
              'OFFER' => 'Offer',
              'HIRED' => 'Hired',
              'REJECTED' => 'Not a match',
              'WITHDRAWN' => 'Withdrawn by the candidate',
              _ => entry.to,
            };

            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    margin: const EdgeInsets.only(top: 4),
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          toLabel,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        if (entry.at != null) ...[
                          const SizedBox(height: 2),
                          Text(
                            dateFmt.format(entry.at!.toLocal()),
                            style: const TextStyle(
                              fontSize: 11,
                              color: AppColors.textMuted,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildBottomAction(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 8,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          width: double.infinity,
          child: OutlinedButton(
            onPressed: _isActionProcessing ? null : _handleWithdraw,
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.error,
              side: const BorderSide(color: AppColors.error),
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: _isActionProcessing
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text(
                    'Withdraw application',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                  ),
          ),
        ),
      ),
    );
  }
}
