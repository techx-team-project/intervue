import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/di/injection_container.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/utils/file_helpers.dart';
import 'package:intervue_flutter/features/application/data/models/screening_question_model.dart';
import 'package:intervue_flutter/features/application/presentation/controllers/apply_job_cubit.dart';
import 'package:intervue_flutter/features/application/presentation/controllers/apply_job_state.dart';
import 'package:intervue_flutter/features/application/presentation/widgets/application_detail_modal.dart';
import 'package:intervue_flutter/features/cover_letter/presentation/views/cover_letter_sheet.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';
import 'package:intervue_flutter/features/resume/data/repositories/resume_repository_impl.dart';

class CandidateApplyModal extends StatefulWidget {
  const CandidateApplyModal({
    required this.jobId,
    required this.jobTitle,
    required this.companyName,
    this.jobEntity,
    super.key,
  });

  final int jobId;
  final String jobTitle;
  final String companyName;
  final JobEntity? jobEntity;

  static Future<void> show(
    BuildContext context, {
    required int jobId,
    required String jobTitle,
    required String companyName,
    JobEntity? jobEntity,
  }) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => BlocProvider(
        create: (_) => getIt<ApplyJobCubit>()..loadForm(jobId),
        child: CandidateApplyModal(
          jobId: jobId,
          jobTitle: jobTitle,
          companyName: companyName,
          jobEntity: jobEntity,
        ),
      ),
    );
  }

  @override
  State<CandidateApplyModal> createState() => _CandidateApplyModalState();
}

class _CandidateApplyModalState extends State<CandidateApplyModal> {
  final TextEditingController _coverLetterController = TextEditingController();
  final Map<int, TextEditingController> _textAnswerControllers = {};
  bool _isUploadingCv = false;

  @override
  void dispose() {
    _coverLetterController.dispose();
    for (final c in _textAnswerControllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _handleUploadNewCv(BuildContext context) async {
    final messenger = ScaffoldMessenger.of(context);
    final cubit = context.read<ApplyJobCubit>();
    final state = cubit.state;
    if (state is! ApplyJobReady) return;

    if (state.resumes.length >= 3) {
      messenger.showSnackBar(
        const SnackBar(
          content: Text(
            'Bạn đã đạt giới hạn 3 CV lưu trữ. Vui lòng chọn một trong các CV đã có.',
          ),
          backgroundColor: AppColors.accentOrange,
        ),
      );
      return;
    }

    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: const ['pdf'],
        withData: true,
      );
      final file = result?.files.single;
      if (file == null || file.bytes == null || !mounted) return;

      if (!FileHelpers.isValidCv(path: file.name, sizeBytes: file.size)) {
        messenger.showSnackBar(
          const SnackBar(
            content: Text('File phải là định dạng PDF và dung lượng dưới 5MB'),
            backgroundColor: AppColors.error,
          ),
        );
        return;
      }

      setState(() => _isUploadingCv = true);
      final newCv = await getIt<ResumeRepositoryImpl>().uploadCandidateCv(
        bytes: file.bytes!,
        fileName: file.name,
      );
      if (!mounted) return;
      setState(() => _isUploadingCv = false);

      cubit.addAndSelectResume(newCv);
      messenger.showSnackBar(
        SnackBar(
          content: Text(
            'Đã tải lên "${newCv.fileName}" và chọn làm CV ứng tuyển',
          ),
          backgroundColor: AppColors.primary,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() => _isUploadingCv = false);
      messenger.showSnackBar(
        const SnackBar(
          content: Text('Không thể tải file lên. Vui lòng thử lại.'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  void _openAiCoverLetter() {
    final job = widget.jobEntity;
    if (job == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Chức năng AI cần đầy đủ thông tin tin tuyển dụng'),
        ),
      );
      return;
    }
    CoverLetterSheet.show(context, job);
  }

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: 0.9,
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
                child: BlocConsumer<ApplyJobCubit, ApplyJobState>(
                  listener: (context, state) {
                    if (state is ApplyJobReady &&
                        _coverLetterController.text.isEmpty &&
                        state.coverLetter.isNotEmpty) {
                      _coverLetterController.text = state.coverLetter;
                    }
                  },
                  builder: (context, state) {
                    return switch (state) {
                      ApplyJobInitial() || ApplyJobLoading() => const Center(
                        child: CircularProgressIndicator(),
                      ),
                      ApplyJobFailure(:final message) => _buildErrorView(
                        context,
                        message,
                      ),
                      ApplyJobSuccess(
                        :final application,
                        :final message,
                        :final isDraft,
                      ) =>
                        _buildSuccessView(
                          context,
                          application.id,
                          message,
                          isDraft,
                        ),
                      ApplyJobReady() => _buildReadyContent(
                        context,
                        state,
                        scrollController,
                      ),
                    };
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHeader(BuildContext context) {
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
                      'Ứng tuyển: ${widget.jobTitle}',
                      style: const TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      widget.companyName,
                      style: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textSecondary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
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

  Widget _buildErrorView(BuildContext context, String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 48, color: AppColors.error),
            const SizedBox(height: 12),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.textSecondary),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () =>
                  context.read<ApplyJobCubit>().loadForm(widget.jobId),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
              ),
              child: const Text('Thử lại'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSuccessView(
    BuildContext context,
    int applicationId,
    String message,
    bool isDraft,
  ) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: isDraft
                  ? AppColors.accentOrangeLight
                  : AppColors.primaryLight,
              shape: BoxShape.circle,
            ),
            child: Icon(
              isDraft ? Icons.drafts_outlined : Icons.check_circle_outline,
              size: 56,
              color: isDraft ? AppColors.accentOrange : AppColors.primary,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            message,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            isDraft
                ? 'Thông tin ứng tuyển của bạn đã được lưu nháp. Bạn có thể quay lại hoàn tất bất cứ lúc nào.'
                : 'Nhà tuyển dụng đã nhận được hồ sơ của bạn và sẽ liên hệ sớm nếu hồ sơ phù hợp.',
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 14,
              color: AppColors.textSecondary,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.push(RouteNames.applications);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Xem danh sách việc đã ứng tuyển',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
              ),
            ),
          ),
          const SizedBox(height: 12),
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text(
              'Đóng',
              style: TextStyle(color: AppColors.textSecondary),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReadyContent(
    BuildContext context,
    ApplyJobReady state,
    ScrollController scrollController,
  ) {
    final form = state.form;
    final existingApp = form.application;

    // Case 1: Active application already submitted
    if (form.hasSubmittedApplication && existingApp != null) {
      return _buildAlreadyAppliedContent(context, state, existingApp);
    }

    // Case 2: Form ready for new submission, draft edit, or reapply
    return Column(
      children: [
        if (state.actionError != null)
          Container(
            width: double.infinity,
            margin: const EdgeInsets.fromLTRB(16, 12, 16, 0),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.badgeUrgentLight,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.info_outline,
                  size: 20,
                  color: AppColors.error,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    state.actionError!,
                    style: const TextStyle(
                      color: AppColors.error,
                      fontSize: 13,
                    ),
                  ),
                ),
              ],
            ),
          ),
        Expanded(
          child: ListView(
            controller: scrollController,
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 80),
            children: [
              if (existingApp?.isWithdrawn == true)
                _buildWithdrawnBanner(context, state, existingApp!),
              _buildCvSelectionSection(context, state),
              const SizedBox(height: 20),
              if (form.questions.isNotEmpty) ...[
                _buildScreeningQuestionsSection(context, state, form.questions),
                const SizedBox(height: 20),
              ],
              _buildCoverLetterSection(context, state),
            ],
          ),
        ),
        _buildBottomActionBar(context, state),
      ],
    );
  }

  Widget _buildAlreadyAppliedContent(
    BuildContext context,
    ApplyJobReady state,
    dynamic existingApp,
  ) {
    final statusLabel = switch (existingApp.status as String) {
      'APPLIED' => 'Đã nộp đơn ứng tuyển',
      'VIEWED' => 'Nhà tuyển dụng đã xem hồ sơ',
      'IN_REVIEW' => 'Đang đánh giá hồ sơ',
      'INTERVIEW' => 'Đã gửi lời mời phỏng vấn',
      'OFFER' => 'Đã gửi đề nghị nhận việc',
      'HIRED' => 'Đã trúng tuyển',
      'REJECTED' => 'Hồ sơ chưa phù hợp',
      _ => existingApp.status as String,
    };

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: AppColors.accentBlueLight,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.assignment_turned_in,
              size: 52,
              color: AppColors.accentBlue,
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'Bạn đã nộp hồ sơ vị trí này',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.accentBlueLight,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Text(
              statusLabel,
              style: const TextStyle(
                color: AppColors.accentBlue,
                fontWeight: FontWeight.w600,
                fontSize: 13,
              ),
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Hồ sơ của bạn hiện đang được quản lý trên hệ thống. Bạn có thể theo dõi tiến trình trong phần Lịch sử ứng tuyển.',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppColors.textSecondary,
              fontSize: 13,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 28),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                ApplicationDetailModal.show(
                  context,
                  applicationId: existingApp.id as int,
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: const Text(
                'Xem chi tiết hồ sơ đã nộp',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ),
          const SizedBox(height: 12),
          if (existingApp.canWithdraw == true)
            OutlinedButton(
              onPressed: state.isSubmitting
                  ? null
                  : () => _showWithdrawConfirmDialog(context),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.error,
                side: const BorderSide(color: AppColors.error),
                padding: const EdgeInsets.symmetric(
                  vertical: 12,
                  horizontal: 24,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: state.isSubmitting
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Rút hồ sơ ứng tuyển'),
            ),
        ],
      ),
    );
  }

  Widget _buildWithdrawnBanner(
    BuildContext context,
    ApplyJobReady state,
    dynamic existingApp,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.accentOrangeLight,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppColors.accentOrange.withValues(alpha: 0.3),
        ),
      ),
      child: const Row(
        children: [
          Icon(
            Icons.warning_amber_rounded,
            color: AppColors.accentOrange,
            size: 22,
          ),
          SizedBox(width: 8),
          Expanded(
            child: Text(
              'Bạn đã từng rút hồ sơ cho công việc này. Bạn có thể chọn CV bên dưới để nộp lại.',
              style: TextStyle(fontSize: 13, color: AppColors.textPrimary),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCvSelectionSection(BuildContext context, ApplyJobReady state) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Chọn CV để ứng tuyển *',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            TextButton.icon(
              onPressed: _isUploadingCv
                  ? null
                  : () => _handleUploadNewCv(context),
              icon: _isUploadingCv
                  ? const SizedBox(
                      width: 14,
                      height: 14,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(
                      Icons.upload_file,
                      size: 16,
                      color: AppColors.primary,
                    ),
              label: Text(
                _isUploadingCv ? 'Đang tải...' : 'Tải CV mới',
                style: const TextStyle(
                  fontSize: 13,
                  color: AppColors.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        if (state.resumes.isEmpty)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: [
                const Icon(
                  Icons.description_outlined,
                  size: 36,
                  color: AppColors.textMuted,
                ),
                const SizedBox(height: 8),
                const Text(
                  'Bạn chưa có CV nào trên hệ thống',
                  style: TextStyle(
                    fontSize: 13,
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: 8),
                ElevatedButton.icon(
                  onPressed: _isUploadingCv
                      ? null
                      : () => _handleUploadNewCv(context),
                  icon: const Icon(Icons.upload_file, size: 16),
                  label: const Text('Tải lên CV dạng PDF'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ],
            ),
          )
        else
          ...state.resumes.map((cv) {
            final isSelected = state.selectedResumeId == cv.id;
            return GestureDetector(
              onTap: () => context.read<ApplyJobCubit>().selectResume(cv.id),
              child: Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primaryLight : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: isSelected ? AppColors.primary : AppColors.border,
                    width: isSelected ? 1.5 : 1.0,
                  ),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 20,
                      height: 20,
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isSelected
                              ? AppColors.primary
                              : AppColors.border,
                          width: 2,
                        ),
                      ),
                      child: isSelected
                          ? Center(
                              child: Container(
                                width: 10,
                                height: 10,
                                decoration: const BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: AppColors.primary,
                                ),
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(width: 8),
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
                            cv.fileName,
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: isSelected
                                  ? FontWeight.bold
                                  : FontWeight.w500,
                              color: AppColors.textPrimary,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          Row(
                            children: [
                              Text(
                                FileHelpers.formatSize(cv.fileSizeBytes),
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: AppColors.textMuted,
                                ),
                              ),
                              if (cv.isDefault) ...[
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 6,
                                    vertical: 1,
                                  ),
                                  decoration: BoxDecoration(
                                    color: AppColors.primaryLight,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: const Text(
                                    'Mặc định',
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
      ],
    );
  }

  Widget _buildScreeningQuestionsSection(
    BuildContext context,
    ApplyJobReady state,
    List<ScreeningQuestionModel> questions,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Câu hỏi từ nhà tuyển dụng',
          style: TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            color: AppColors.textPrimary,
          ),
        ),
        const SizedBox(height: 4),
        const Text(
          'Vui lòng trả lời để nhà tuyển dụng hiểu rõ hơn về bạn',
          style: TextStyle(fontSize: 12, color: AppColors.textMuted),
        ),
        const SizedBox(height: 12),
        ...questions.map((q) {
          final currentAnswer = state.answers[q.id] ?? '';
          return Container(
            margin: const EdgeInsets.only(bottom: 14),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: RichText(
                        text: TextSpan(
                          text: q.prompt,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                          children: [
                            if (q.required)
                              const TextSpan(
                                text: ' *',
                                style: TextStyle(
                                  color: AppColors.error,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                if (q.type == ScreeningQuestionType.choice)
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: q.options.map((option) {
                      final isChosen = currentAnswer == option;
                      return ChoiceChip(
                        label: Text(option),
                        selected: isChosen,
                        selectedColor: AppColors.primaryLight,
                        labelStyle: TextStyle(
                          fontSize: 12,
                          color: isChosen
                              ? AppColors.primary
                              : AppColors.textPrimary,
                          fontWeight: isChosen
                              ? FontWeight.bold
                              : FontWeight.normal,
                        ),
                        side: BorderSide(
                          color: isChosen
                              ? AppColors.primary
                              : AppColors.border,
                        ),
                        onSelected: (selected) {
                          if (selected) {
                            context.read<ApplyJobCubit>().updateAnswer(
                              q.id,
                              option,
                            );
                          }
                        },
                      );
                    }).toList(),
                  )
                else ...[
                  TextField(
                    controller: _textAnswerControllers.putIfAbsent(
                      q.id,
                      () => TextEditingController(text: currentAnswer),
                    ),
                    maxLines: 2,
                    style: const TextStyle(fontSize: 13),
                    decoration: InputDecoration(
                      hintText: 'Nhập câu trả lời...',
                      hintStyle: const TextStyle(
                        fontSize: 13,
                        color: AppColors.textMuted,
                      ),
                      contentPadding: const EdgeInsets.all(10),
                      fillColor: Colors.white,
                      filled: true,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                        borderSide: const BorderSide(color: AppColors.border),
                      ),
                    ),
                    onChanged: (text) =>
                        context.read<ApplyJobCubit>().updateAnswer(q.id, text),
                  ),
                ],
              ],
            ),
          );
        }),
      ],
    );
  }

  Widget _buildCoverLetterSection(BuildContext context, ApplyJobReady state) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Thư giới thiệu (Cover Letter)',
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            if (widget.jobEntity != null)
              TextButton.icon(
                onPressed: _openAiCoverLetter,
                icon: const Icon(
                  Icons.auto_awesome,
                  size: 14,
                  color: AppColors.accentPurple,
                ),
                label: const Text(
                  'Tạo bằng AI',
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.accentPurple,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 6),
        TextField(
          controller: _coverLetterController,
          maxLines: 5,
          maxLength: 5000,
          style: const TextStyle(fontSize: 13),
          decoration: InputDecoration(
            hintText: 'Giới thiệu ngắn gọn kinh nghiệm, kỹ năng và lý do bạn muốn ứng tuyển vị trí này...',
            hintStyle: const TextStyle(
              fontSize: 13,
              color: AppColors.textMuted,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(
                color: AppColors.primary,
                width: 1.5,
              ),
            ),
          ),
          onChanged: (val) =>
              context.read<ApplyJobCubit>().updateCoverLetter(val),
        ),
      ],
    );
  }

  Widget _buildBottomActionBar(BuildContext context, ApplyJobReady state) {
    final isReapplying = state.form.application?.isWithdrawn == true;

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
        child: Row(
          children: [
            if (!isReapplying) ...[
              Expanded(
                flex: 1,
                child: OutlinedButton(
                  onPressed: state.isSavingDraft || state.isSubmitting
                      ? null
                      : () => context.read<ApplyJobCubit>().saveDraft(),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    side: const BorderSide(color: AppColors.border),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: state.isSavingDraft
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text(
                          'Lưu nháp',
                          style: TextStyle(
                            color: AppColors.textSecondary,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                ),
              ),
              const SizedBox(width: 12),
            ],
            Expanded(
              flex: 2,
              child: ElevatedButton(
                onPressed: state.isSubmitting || state.isSavingDraft
                    ? null
                    : () {
                        if (isReapplying) {
                          if (state.selectedResumeId != null) {
                            context.read<ApplyJobCubit>().reapply(
                              state.selectedResumeId!,
                            );
                          }
                        } else {
                          context.read<ApplyJobCubit>().submit();
                        }
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                child: state.isSubmitting
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : Text(
                        isReapplying ? 'Nộp lại hồ sơ' : 'Nộp hồ sơ ngay',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 15,
                        ),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showWithdrawConfirmDialog(BuildContext context) {
    showDialog<bool>(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text(
          'Rút hồ sơ ứng tuyển?',
          style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
        ),
        content: const Text(
          'Bạn có chắc chắn muốn rút hồ sơ cho vị trí này không? Nhà tuyển dụng sẽ không còn thấy hồ sơ của bạn.',
          style: TextStyle(fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogCtx).pop(false),
            child: const Text('Không'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(dialogCtx).pop(true);
              context.read<ApplyJobCubit>().withdraw();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: Colors.white,
            ),
            child: const Text('Rút hồ sơ'),
          ),
        ],
      ),
    );
  }
}
