import 'package:flutter/material.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_job_card.dart';

class JobCardItem extends StatelessWidget {
  const JobCardItem({
    required this.job,
    this.onTap,
    this.isBookmarked = false,
    this.onBookmarkTap,
    this.onApplyTap,
    super.key,
  });

  final JobEntity job;
  final VoidCallback? onTap;
  final bool isBookmarked;
  final VoidCallback? onBookmarkTap;
  final VoidCallback? onApplyTap;

  @override
  Widget build(BuildContext context) {
    return TopCvJobCard(
      job: job,
      onTap: onTap,
      isBookmarked: isBookmarked,
      onBookmarkTap: onBookmarkTap,
      onApplyTap: onApplyTap,
    );
  }
}
