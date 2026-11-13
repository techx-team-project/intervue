import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/features/cover_letter/presentation/controllers/cover_letter_cubit.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';

class CoverLetterSheet extends StatelessWidget {
  const CoverLetterSheet({required this.job, super.key});

  final JobEntity job;

  static Future<void> show(BuildContext context, JobEntity job) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => BlocProvider(
        create: (_) => GetIt.instance<CoverLetterCubit>()..generate(job),
        child: CoverLetterSheet(job: job),
      ),
    );
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
          child: BlocBuilder<CoverLetterCubit, CoverLetterState>(
            builder: (context, state) {
              return Column(
                children: [
                  Center(
                    child: Container(
                      margin: const EdgeInsets.only(top: 10, bottom: 6),
                      width: 40,
                      height: 4,
                      decoration: BoxDecoration(
                        color: AppColors.border,
                        borderRadius: BorderRadius.circular(2),
                      ),
                    ),
                  ),
                  _buildHeader(context),
                  const Divider(height: 1),
                  Expanded(
                    child: ListView(
                      controller: scrollController,
                      padding: const EdgeInsets.all(16),
                      children: [
                        _buildLanguageChips(context, state),
                        const SizedBox(height: 16),
                        _buildBody(context, state),
                      ],
                    ),
                  ),
                ],
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 4, 8, 8),
      child: Row(
        children: [
          const Icon(Icons.auto_awesome_rounded, color: AppColors.primary),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'AI Cover Letter',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                Text(
                  '${job.title} • ${job.companyName}',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.close_rounded),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageChips(BuildContext context, CoverLetterState state) {
    final loading = state.status == CoverLetterStatus.loading;
    return Wrap(
      spacing: 8,
      children: [
        for (final language in CoverLetterLanguage.values)
          ChoiceChip(
            label: Text(language.label),
            selected: state.language == language,
            onSelected: loading
                ? null
                : (_) => context.read<CoverLetterCubit>().generate(
                    job,
                    language: language,
                  ),
          ),
      ],
    );
  }

  Widget _buildBody(BuildContext context, CoverLetterState state) {
    switch (state.status) {
      case CoverLetterStatus.loading:
        return const Padding(
          padding: EdgeInsets.symmetric(vertical: 48),
          child: Column(
            children: [
              CircularProgressIndicator(color: AppColors.primary),
              SizedBox(height: 14),
              Text(
                'AI is writing your cover letter...',
                style: TextStyle(color: AppColors.textSecondary),
              ),
            ],
          ),
        );
      case CoverLetterStatus.failure:
        return Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.badgeUrgentLight,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.error.withValues(alpha: 0.3)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                state.errorMessage ?? 'Unable to generate the cover letter.',
                style: const TextStyle(color: AppColors.error, height: 1.4),
              ),
              const SizedBox(height: 10),
              OutlinedButton.icon(
                onPressed: () => context.read<CoverLetterCubit>().generate(
                  job,
                  language: state.language,
                ),
                icon: const Icon(Icons.refresh_rounded),
                label: const Text('Try again'),
              ),
            ],
          ),
        );
      case CoverLetterStatus.success:
        final letter = state.letter!;
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border),
              ),
              child: SelectableText(
                letter.text,
                style: const TextStyle(
                  fontSize: 14,
                  height: 1.55,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            if (letter.notice.isNotEmpty) ...[
              const SizedBox(height: 10),
              Text(
                letter.notice,
                style: const TextStyle(
                  fontSize: 11.5,
                  color: AppColors.textMuted,
                  height: 1.4,
                ),
              ),
            ],
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: () async {
                      await Clipboard.setData(ClipboardData(text: letter.text));
                      if (!context.mounted) return;
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Cover letter copied')),
                      );
                    },
                    icon: const Icon(Icons.copy_rounded),
                    label: const Text('Copy'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => context.read<CoverLetterCubit>().generate(
                      job,
                      language: state.language,
                    ),
                    icon: const Icon(Icons.refresh_rounded),
                    label: const Text('Rewrite'),
                  ),
                ),
              ],
            ),
          ],
        );
    }
  }
}
