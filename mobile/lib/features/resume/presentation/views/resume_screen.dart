import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/widgets/ai_consent_dialog.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/resume_review_cubit.dart';
import 'package:intervue_flutter/features/resume/presentation/widgets/credit_sheets.dart';
import 'package:intervue_flutter/features/resume/presentation/widgets/cv_review_options.dart';
import 'package:intervue_flutter/features/resume/presentation/widgets/review_form_pickers.dart';
import 'package:intervue_flutter/features/resume/presentation/widgets/review_result_views.dart';

class ResumeScreen extends StatefulWidget {
  const ResumeScreen({super.key});

  @override
  State<ResumeScreen> createState() => _ResumeScreenState();
}

class _ResumeScreenState extends State<ResumeScreen> {
  final _positionController = TextEditingController(
    text: CvReviewOptions.popularPositions.first,
  );
  final _cvTextController = TextEditingController();

  int _level = 2;
  CvSource? _source;
  int? _resumeId;
  String? _jobId;
  PlatformFile? _pickedFile;

  @override
  void dispose() {
    _positionController.dispose();
    _cvTextController.dispose();
    super.dispose();
  }

  bool get _isPaid => _level == CvReviewOptions.paidLevel;

  CvSource _effectiveSource(ResumeReviewState state) =>
      _source ?? (state.resumes.isNotEmpty ? CvSource.saved : CvSource.upload);

  int? _effectiveResumeId(ResumeReviewState state) {
    if (state.resumes.isEmpty) return null;
    if (_resumeId != null) return _resumeId;
    return state.resumes
        .firstWhere((cv) => cv.isDefault, orElse: () => state.resumes.first)
        .id;
  }

  String? _effectiveJobId(ResumeReviewState state) =>
      _jobId ?? (state.jobs.isEmpty ? null : state.jobs.first.id);

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

  void _toast(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  Future<void> _submit(ResumeReviewState state) async {
    final source = _effectiveSource(state);
    final resumeId = _effectiveResumeId(state);
    final jobId = _effectiveJobId(state);
    final file = _pickedFile;

    if (_level == 2 && _positionController.text.trim().isEmpty) {
      return _toast('Enter the target job position.');
    }
    if (_isPaid && jobId == null) {
      return _toast('Choose a job post to match against.');
    }
    if (_isPaid && state.creditBalance < 1) {
      _toast('You do not have enough credits. Please top up to continue.');
      return CreditSheets.showTopup(context);
    }
    if (source == CvSource.saved && resumeId == null) {
      return _toast('Choose a saved CV or upload a new file.');
    }
    if (source == CvSource.upload && (file == null || file.bytes == null)) {
      return _toast('Choose a PDF CV to review.');
    }
    if (source == CvSource.text && _cvTextController.text.trim().isEmpty) {
      return _toast('Paste the text of your CV.');
    }
    if (!await AiConsent.ensure(context) || !mounted) return;

    final cubit = context.read<ResumeReviewCubit>();
    final targetPosition = _positionController.text;
    final parsedJobId = jobId == null ? null : int.tryParse(jobId);
    switch (source) {
      case CvSource.upload:
        await cubit.reviewFile(
          bytes: file!.bytes!,
          fileName: file.name,
          sizeBytes: file.size,
          level: _level,
          targetPosition: targetPosition,
          jobId: parsedJobId,
        );
      case CvSource.saved:
        await cubit.reviewSaved(
          level: _level,
          resumeId: resumeId,
          targetPosition: targetPosition,
          jobId: parsedJobId,
        );
      case CvSource.text:
        await cubit.reviewSaved(
          level: _level,
          cvText: _cvTextController.text,
          targetPosition: targetPosition,
          jobId: parsedJobId,
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text(
          'AI CV review',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
            color: AppColors.textPrimary,
          ),
        ),
      ),
      body: BlocConsumer<ResumeReviewCubit, ResumeReviewState>(
        listenWhen: (previous, current) =>
            previous.errorCode != current.errorCode &&
            current.errorCode == ResumeReviewCubit.insufficientCreditsCode,
        listener: (context, state) => CreditSheets.showTopup(context),
        builder: (context, state) {
          final review = state.review;
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              if (review != null)
                review.isJobFit
                    ? JobFitReport(
                        review: review,
                        onReset: context.read<ResumeReviewCubit>().reset,
                        onOpenCreditHistory: () =>
                            CreditSheets.showHistory(context),
                      )
                    : AtsReviewReport(
                        review: review,
                        onReset: context.read<ResumeReviewCubit>().reset,
                      )
              else
                ..._buildForm(state),
            ],
          );
        },
      ),
    );
  }

  List<Widget> _buildForm(ResumeReviewState state) {
    final source = _effectiveSource(state);
    return [
      const Padding(
        padding: EdgeInsets.only(bottom: 14),
        child: Text(
          'Get an ATS score and concrete rewrites for your CV, tailored to a target role or matched against a real job post.',
          style: TextStyle(
            fontSize: 13,
            height: 1.45,
            color: AppColors.textSecondary,
          ),
        ),
      ),
      ReviewStepCard(
        step: '01',
        title: 'Choose a review level',
        child: ReviewLevelPicker(
          value: _level,
          onChanged: (level) => setState(() => _level = level),
        ),
      ),
      if (_level == 2)
        ReviewStepCard(
          step: '02',
          title: 'Target position',
          hint: 'The role you want your CV to be optimized for.',
          child: ReviewTargetPositionField(controller: _positionController),
        ),
      if (_isPaid)
        ReviewStepCard(
          step: '02',
          title: 'Job to match',
          hint: 'Pick the job post your CV will be compared against.',
          child: ReviewJobPicker(
            jobs: state.jobs,
            selectedJobId: _effectiveJobId(state),
            onSelected: (id) => setState(() => _jobId = id),
          ),
        ),
      ReviewStepCard(
        step: _level == 1 ? '02' : '03',
        title: 'Your CV',
        child: ReviewCvSourcePicker(
          source: source,
          onSourceChanged: (value) => setState(() => _source = value),
          resumes: state.resumes,
          selectedResumeId: _effectiveResumeId(state),
          onResumeSelected: (id) => setState(() => _resumeId = id),
          file: _pickedFile,
          onPickFile: _pickFile,
          textController: _cvTextController,
        ),
      ),
      if (state.status == ResumeReviewStatus.failure &&
          state.errorMessage != null)
        _ErrorBanner(message: state.errorMessage!),
      _buildActionCard(state),
    ];
  }

  Widget _buildActionCard(ResumeReviewState state) {
    final quota = state.quota;
    final isBusy = state.isReviewing;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _Stat(
                  label: 'Free runs today',
                  value: quota == null
                      ? '3/3'
                      : '${quota.remaining}/${quota.maxDaily}',
                ),
              ),
              Expanded(
                child: _Stat(label: 'Credits', value: '${state.creditBalance}'),
              ),
            ],
          ),
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: FilledButton.icon(
              onPressed: isBusy ? null : () => _submit(state),
              icon: isBusy
                  ? const SizedBox.square(
                      dimension: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Icon(Icons.auto_awesome_rounded),
              label: Text(
                isBusy
                    ? 'Analyzing…'
                    : _isPaid
                    ? 'Match with job (1 credit)'
                    : 'Review my CV',
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            _isPaid
                ? 'A failed AI run is refunded automatically. Re-running the same CV on the same job is free.'
                : 'Free runs reset every day.',
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
            ),
          ),
          const Divider(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              TextButton.icon(
                onPressed: () => CreditSheets.showTopup(context),
                icon: const Icon(Icons.toll_rounded, size: 18),
                label: const Text('Top up credits'),
              ),
              TextButton(
                onPressed: () => CreditSheets.showHistory(context),
                child: const Text('History'),
              ),
            ],
          ),
          const Padding(
            padding: EdgeInsets.only(top: 4),
            child: Text(
              'AI only assists. Your CV is processed privately and is never shared with recruiters by this tool.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 11.5, color: AppColors.textMuted),
            ),
          ),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  const _Stat({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 11.5,
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          value,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: AppColors.textPrimary,
          ),
        ),
      ],
    );
  }
}

class _ErrorBanner extends StatelessWidget {
  const _ErrorBanner({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
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
