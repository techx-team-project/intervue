import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/utils/file_helpers.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_resume_model.dart';
import 'package:intervue_flutter/features/resume/presentation/widgets/cv_review_options.dart';

class ReviewStepCard extends StatelessWidget {
  const ReviewStepCard({
    required this.step,
    required this.title,
    required this.child,
    this.hint,
    super.key,
  });

  final String step;
  final String title;
  final String? hint;
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  step,
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryDarker,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14.5,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
            ],
          ),
          if (hint != null) ...[
            const SizedBox(height: 4),
            Text(
              hint!,
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
            ),
          ],
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

class _SelectableTile extends StatelessWidget {
  const _SelectableTile({
    required this.selected,
    required this.onTap,
    required this.child,
  });

  final bool selected;
  final VoidCallback onTap;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: selected ? AppColors.primaryLight : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: selected ? AppColors.primary : AppColors.border,
              width: selected ? 1.5 : 1,
            ),
          ),
          child: child,
        ),
      ),
    );
  }
}

class ReviewLevelPicker extends StatelessWidget {
  const ReviewLevelPicker({
    required this.value,
    required this.onChanged,
    super.key,
  });

  final int value;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: CvReviewOptions.levels.map((item) {
        final selected = value == item.level;
        return _SelectableTile(
          selected: selected,
          onTap: () => onChanged(item.level),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'LEVEL ${item.level}${item.isPaid ? ' · PAID' : ''}',
                      style: const TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.6,
                        color: AppColors.textMuted,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      item.title,
                      style: const TextStyle(
                        fontSize: 14.5,
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      item.description,
                      style: const TextStyle(
                        fontSize: 12,
                        height: 1.4,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      item.cost,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ),
              if (selected)
                const Icon(
                  Icons.check_circle_rounded,
                  size: 20,
                  color: AppColors.primary,
                ),
            ],
          ),
        );
      }).toList(),
    );
  }
}

class ReviewTargetPositionField extends StatelessWidget {
  const ReviewTargetPositionField({required this.controller, super.key});

  final TextEditingController controller;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        TextField(
          controller: controller,
          decoration: InputDecoration(
            hintText: 'e.g. Backend Java Developer',
            prefixIcon: const Icon(Icons.work_outline_rounded),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        const SizedBox(height: 10),
        ListenableBuilder(
          listenable: controller,
          builder: (context, _) => Wrap(
            spacing: 8,
            runSpacing: 8,
            children: CvReviewOptions.popularPositions
                .map(
                  (position) => ChoiceChip(
                    label: Text(position),
                    selected: controller.text == position,
                    onSelected: (_) => controller.text = position,
                  ),
                )
                .toList(),
          ),
        ),
      ],
    );
  }
}

class ReviewJobPicker extends StatelessWidget {
  const ReviewJobPicker({
    required this.jobs,
    required this.selectedJobId,
    required this.onSelected,
    super.key,
  });

  final List<JobEntity> jobs;
  final String? selectedJobId;
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) {
    if (jobs.isEmpty) {
      return const Text(
        'No job posts available right now.',
        style: TextStyle(
          fontSize: 12,
          fontStyle: FontStyle.italic,
          color: AppColors.textMuted,
        ),
      );
    }
    return ConstrainedBox(
      constraints: const BoxConstraints(maxHeight: 320),
      child: ListView(
        shrinkWrap: true,
        children: jobs.map((job) {
          return _SelectableTile(
            selected: selectedJobId == job.id,
            onTap: () => onSelected(job.id),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        job.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      Text(
                        job.companyName,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 11.5,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
                if (selectedJobId == job.id)
                  const Icon(
                    Icons.check_circle_rounded,
                    size: 18,
                    color: AppColors.primary,
                  ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}

class ReviewCvSourcePicker extends StatelessWidget {
  const ReviewCvSourcePicker({
    required this.source,
    required this.onSourceChanged,
    required this.resumes,
    required this.selectedResumeId,
    required this.onResumeSelected,
    required this.file,
    required this.onPickFile,
    required this.textController,
    super.key,
  });

  final CvSource source;
  final ValueChanged<CvSource> onSourceChanged;
  final List<CandidateResumeModel> resumes;
  final int? selectedResumeId;
  final ValueChanged<int> onResumeSelected;
  final PlatformFile? file;
  final VoidCallback onPickFile;
  final TextEditingController textController;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SegmentedButton<CvSource>(
          showSelectedIcon: false,
          segments: CvSource.values
              .map(
                (value) => ButtonSegment(
                  value: value,
                  label: Text(
                    value.label,
                    style: const TextStyle(fontSize: 11),
                  ),
                ),
              )
              .toList(),
          selected: {source},
          onSelectionChanged: (selection) => onSourceChanged(selection.first),
        ),
        const SizedBox(height: 12),
        switch (source) {
          CvSource.saved => _buildSaved(),
          CvSource.upload => _buildUpload(),
          CvSource.text => TextField(
            controller: textController,
            minLines: 6,
            maxLines: 12,
            decoration: InputDecoration(
              hintText: 'Paste the text of your CV here...',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        },
      ],
    );
  }

  Widget _buildSaved() {
    if (resumes.isEmpty) {
      return const Text(
        'No saved CVs yet. Upload a PDF or paste your CV text instead.',
        style: TextStyle(
          fontSize: 12,
          fontStyle: FontStyle.italic,
          color: AppColors.textMuted,
        ),
      );
    }
    return Column(
      children: resumes.map((cv) {
        return _SelectableTile(
          selected: selectedResumeId == cv.id,
          onTap: () => onResumeSelected(cv.id),
          child: Row(
            children: [
              const Icon(
                Icons.description_outlined,
                size: 20,
                color: AppColors.textMuted,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  cv.fileName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
              if (cv.isDefault)
                const Padding(
                  padding: EdgeInsets.only(left: 6),
                  child: Text(
                    'Default',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildUpload() {
    return InkWell(
      onTap: onPickFile,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 22, horizontal: 12),
        decoration: BoxDecoration(
          color: AppColors.primaryLight,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.primary.withValues(alpha: 0.4)),
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
              file == null ? 'Tap to choose a CV file (PDF)' : file!.name,
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
                  ? 'Pick from device • max 5 MB • text-based PDF'
                  : FileHelpers.formatSize(file!.size),
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
