import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/utils/file_helpers.dart';
import 'package:intervue_flutter/features/resume/data/models/cv_review.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/resume_review_cubit.dart';

class ResumeScreen extends StatefulWidget {
  const ResumeScreen({super.key});

  @override
  State<ResumeScreen> createState() => _ResumeScreenState();
}

class _ResumeScreenState extends State<ResumeScreen> {
  final _positionController = TextEditingController();
  PlatformFile? _pickedFile;

  @override
  void dispose() {
    _positionController.dispose();
    super.dispose();
  }

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: const ['pdf'],
      withData: true,
    );
    final file = result?.files.single;
    if (file == null || !mounted) return;
    setState(() => _pickedFile = file);
  }

  Future<void> _submit() async {
    final file = _pickedFile;
    final bytes = file?.bytes;
    if (file == null || bytes == null) return;
    await context.read<ResumeReviewCubit>().reviewCv(
      bytes: bytes,
      fileName: file.name,
      sizeBytes: file.size,
      targetPosition: _positionController.text,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'AI chấm điểm CV',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
            color: AppColors.textPrimary,
          ),
        ),
      ),
      body: BlocBuilder<ResumeReviewCubit, ResumeReviewState>(
        builder: (context, state) {
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              _QuotaChip(quota: state.quota),
              const SizedBox(height: 12),
              _buildUploadCard(state),
              if (state.status == ResumeReviewStatus.failure &&
                  state.errorMessage != null) ...[
                const SizedBox(height: 12),
                _ErrorBanner(message: state.errorMessage!),
              ],
              if (state.isUploading) ...[
                const SizedBox(height: 24),
                const _AnalyzingIndicator(),
              ],
              if (state.review != null) ...[
                const SizedBox(height: 16),
                _ReviewResult(review: state.review!),
              ],
            ],
          );
        },
      ),
    );
  }

  Widget _buildUploadCard(ResumeReviewState state) {
    final file = _pickedFile;
    final isBusy = state.isUploading;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          InkWell(
            onTap: isBusy ? null : _pickFile,
            borderRadius: BorderRadius.circular(12),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 22, horizontal: 12),
              decoration: BoxDecoration(
                color: AppColors.primaryLight,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: AppColors.primary.withValues(alpha: 0.4),
                ),
              ),
              child: Column(
                children: [
                  Icon(
                    file == null
                        ? Icons.upload_file_rounded
                        : Icons.picture_as_pdf_rounded,
                    size: 36,
                    color: AppColors.primaryDark,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    file == null ? 'Chạm để chọn file CV (PDF)' : file.name,
                    textAlign: TextAlign.center,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      color: AppColors.primaryDarker,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    file == null
                        ? 'Chọn từ thiết bị • tối đa 5 MB • PDF dạng văn bản'
                        : FileHelpers.formatSize(file.size),
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: _positionController,
            enabled: !isBusy,
            textInputAction: TextInputAction.done,
            decoration: InputDecoration(
              labelText: 'Vị trí ứng tuyển mong muốn (không bắt buộc)',
              hintText: 'Ví dụ: Flutter Developer',
              prefixIcon: const Icon(Icons.work_outline_rounded),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            height: 46,
            child: ElevatedButton.icon(
              onPressed: (file == null || isBusy) ? null : _submit,
              icon: const Icon(Icons.auto_awesome_rounded),
              label: Text(
                isBusy
                    ? 'Đang tải lên & phân tích...'
                    : 'Tải lên & chấm điểm CV',
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _QuotaChip extends StatelessWidget {
  const _QuotaChip({required this.quota});

  final CvReviewQuota? quota;

  @override
  Widget build(BuildContext context) {
    final text = quota == null
        ? 'Mỗi ngày bạn có một số lượt chấm CV miễn phí'
        : 'Còn ${quota!.remaining}/${quota!.maxDaily} lượt chấm CV hôm nay';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.accentBlueLight,
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        children: [
          const Icon(Icons.bolt_rounded, size: 18, color: AppColors.accentBlue),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 12.5,
                fontWeight: FontWeight.w600,
                color: AppColors.accentBlue,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ErrorBanner extends StatelessWidget {
  const _ErrorBanner({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.badgeUrgentLight,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(
            Icons.error_outline_rounded,
            size: 18,
            color: AppColors.error,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(
                fontSize: 12.5,
                color: AppColors.error,
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AnalyzingIndicator extends StatelessWidget {
  const _AnalyzingIndicator();

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: [
        CircularProgressIndicator(color: AppColors.primary),
        SizedBox(height: 12),
        Text(
          'AI đang đọc và phân tích CV của bạn...',
          style: TextStyle(color: AppColors.textSecondary, fontSize: 13),
        ),
      ],
    );
  }
}

class _ReviewResult extends StatelessWidget {
  const _ReviewResult({required this.review});

  final CvReview review;

  static Color _scoreColor(int score) {
    if (score >= 80) return AppColors.success;
    if (score >= 60) return AppColors.star;
    return AppColors.error;
  }

  @override
  Widget build(BuildContext context) {
    final color = _scoreColor(review.overallScore);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              SizedBox(
                width: 84,
                height: 84,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox.expand(
                      child: CircularProgressIndicator(
                        value: review.overallScore.clamp(0, 100) / 100,
                        strokeWidth: 8,
                        color: color,
                        backgroundColor: AppColors.chipBackground,
                      ),
                    ),
                    Text(
                      '${review.overallScore}',
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w900,
                        color: color,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Điểm tổng quan',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      review.summary,
                      style: const TextStyle(
                        fontSize: 12.5,
                        color: AppColors.textSecondary,
                        height: 1.4,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        if (review.fromCache) ...[
          const SizedBox(height: 8),
          const Text(
            'CV không thay đổi nên dùng lại kết quả đã lưu, không trừ lượt.',
            style: TextStyle(fontSize: 11.5, color: AppColors.textMuted),
          ),
        ],
        if (review.comments.isNotEmpty) ...[
          const SizedBox(height: 16),
          const Text(
            'Góp ý chi tiết',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 15,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          for (final comment in review.comments) _CommentCard(comment: comment),
        ],
      ],
    );
  }
}

class _CommentCard extends StatelessWidget {
  const _CommentCard({required this.comment});

  final CvReviewComment comment;

  @override
  Widget build(BuildContext context) {
    return Container(
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
            label: 'Vấn đề',
            text: comment.problem,
          ),
          const SizedBox(height: 6),
          _LabeledLine(
            icon: Icons.lightbulb_outline_rounded,
            color: AppColors.primaryDark,
            label: 'Gợi ý sửa',
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
