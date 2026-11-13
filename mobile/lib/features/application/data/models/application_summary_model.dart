import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

class ApplicationSummaryModel extends Equatable {
  const ApplicationSummaryModel({
    required this.id,
    required this.status,
    required this.jobId,
    required this.jobTitle,
    this.companyId,
    this.companyName,
    this.submittedAt,
    this.updatedAt,
  });

  factory ApplicationSummaryModel.fromJson(Map<String, dynamic> json) =>
      ApplicationSummaryModel(
        id: (json['id'] as num).toInt(),
        status: json['status'] as String? ?? 'APPLIED',
        jobId: (json['jobId'] as num).toInt(),
        jobTitle: json['jobTitle'] as String? ?? '',
        companyId: (json['companyId'] as num?)?.toInt(),
        companyName: json['companyName'] as String?,
        submittedAt: json['submittedAt'] != null
            ? DateTime.tryParse(json['submittedAt'] as String)
            : null,
        updatedAt: json['updatedAt'] != null
            ? DateTime.tryParse(json['updatedAt'] as String)
            : null,
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'status': status,
    'jobId': jobId,
    'jobTitle': jobTitle,
    if (companyId != null) 'companyId': companyId,
    if (companyName != null) 'companyName': companyName,
    if (submittedAt != null) 'submittedAt': submittedAt?.toIso8601String(),
    if (updatedAt != null) 'updatedAt': updatedAt?.toIso8601String(),
  };

  final int id;
  final String status;
  final int jobId;
  final String jobTitle;
  final int? companyId;
  final String? companyName;
  final DateTime? submittedAt;
  final DateTime? updatedAt;

  bool get isDraft => status == 'DRAFT';
  bool get isApplied => status == 'APPLIED';
  bool get isViewed => status == 'VIEWED';
  bool get isInReview => status == 'IN_REVIEW';
  bool get isInterview => status == 'INTERVIEW';
  bool get isOffer => status == 'OFFER';
  bool get isHired => status == 'HIRED';
  bool get isRejected => status == 'REJECTED';
  bool get isWithdrawn => status == 'WITHDRAWN';
  bool get isJobClosed => status == 'JOB_CLOSED';

  String get statusLabelVi {
    switch (status) {
      case 'DRAFT':
        return 'Draft';
      case 'APPLIED':
        return 'Applied';
      case 'VIEWED':
        return 'Viewed';
      case 'IN_REVIEW':
        return 'In review';
      case 'INTERVIEW':
        return 'Interview invited';
      case 'OFFER':
        return 'Offer';
      case 'HIRED':
        return 'Hired';
      case 'REJECTED':
        return 'Not a match';
      case 'WITHDRAWN':
        return 'Withdrawn';
      case 'JOB_CLOSED':
        return 'Job closed';
      default:
        return status;
    }
  }

  Color get statusBadgeColor {
    switch (status) {
      case 'APPLIED':
        return AppColors.accentBlue;
      case 'VIEWED':
        return AppColors.accentPurple;
      case 'IN_REVIEW':
        return AppColors.accentOrange;
      case 'INTERVIEW':
        return const Color(0xFF4F46E5);
      case 'OFFER':
      case 'HIRED':
        return AppColors.primary;
      case 'REJECTED':
        return AppColors.error;
      case 'DRAFT':
      case 'WITHDRAWN':
      case 'JOB_CLOSED':
      default:
        return AppColors.textMuted;
    }
  }

  Color get statusBadgeBackgroundColor {
    switch (status) {
      case 'APPLIED':
        return AppColors.accentBlueLight;
      case 'VIEWED':
        return AppColors.accentPurpleLight;
      case 'IN_REVIEW':
        return AppColors.accentOrangeLight;
      case 'INTERVIEW':
        return const Color(0xFFEEF2FF);
      case 'OFFER':
      case 'HIRED':
        return AppColors.primaryLight;
      case 'REJECTED':
        return AppColors.badgeUrgentLight;
      case 'DRAFT':
      case 'WITHDRAWN':
      case 'JOB_CLOSED':
      default:
        return AppColors.chipBackground;
    }
  }

  @override
  List<Object?> get props => [
    id,
    status,
    jobId,
    jobTitle,
    companyId,
    companyName,
    submittedAt,
    updatedAt,
  ];
}
