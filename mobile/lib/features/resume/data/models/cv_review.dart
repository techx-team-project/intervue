import 'package:equatable/equatable.dart';

class CvReviewComment extends Equatable {
  const CvReviewComment({
    required this.section,
    required this.quote,
    required this.problem,
    required this.fix,
  });

  factory CvReviewComment.fromJson(Map<String, dynamic> json) =>
      CvReviewComment(
        section: json['section'] as String? ?? '',
        quote: json['quote'] as String? ?? '',
        problem: json['problem'] as String? ?? '',
        fix: json['fix'] as String? ?? '',
      );

  final String section;
  final String quote;
  final String problem;
  final String fix;

  @override
  List<Object?> get props => [section, quote, problem, fix];
}

class JobRequirementMatch extends Equatable {
  const JobRequirementMatch({
    required this.requirement,
    required this.status,
    required this.cvEvidence,
    required this.explanation,
    required this.fitScore,
    required this.improvementTip,
  });

  factory JobRequirementMatch.fromJson(Map<String, dynamic> json) =>
      JobRequirementMatch(
        requirement: json['requirement'] as String? ?? '',
        status: json['status'] as String? ?? '',
        cvEvidence: json['cvEvidence'] as String? ?? '',
        explanation: json['explanation'] as String? ?? '',
        fitScore: (json['fitScore'] as num?)?.toInt() ?? 0,
        improvementTip: json['improvementTip'] as String? ?? '',
      );

  final String requirement;
  final String status;
  final String cvEvidence;
  final String explanation;
  final int fitScore;
  final String improvementTip;

  @override
  List<Object?> get props => [
    requirement,
    status,
    cvEvidence,
    explanation,
    fitScore,
    improvementTip,
  ];
}

class CvReview extends Equatable {
  const CvReview({
    required this.overallScore,
    required this.summary,
    required this.comments,
    required this.fromCache,
    this.modelVersion = '',
    this.reviewLevel,
    this.jobId,
    this.jobTitle,
    this.companyName,
    this.jobFitScore,
    this.requirementMatches = const [],
    this.keyStrengths = const [],
    this.gapAnalysis = const [],
    this.tailoringTips = const [],
    this.chargedCredits,
  });

  factory CvReview.fromJson(Map<String, dynamic> json) => CvReview(
    overallScore: (json['overallScore'] as num?)?.toInt() ?? 0,
    summary: json['summary'] as String? ?? '',
    comments: (json['comments'] as List<dynamic>? ?? const [])
        .map((e) => CvReviewComment.fromJson(e as Map<String, dynamic>))
        .toList(),
    fromCache: json['fromCache'] as bool? ?? false,
    modelVersion: json['modelVersion'] as String? ?? '',
    reviewLevel: (json['reviewLevel'] as num?)?.toInt(),
    jobId: (json['jobId'] as num?)?.toInt(),
    jobTitle: json['jobTitle'] as String?,
    companyName: json['companyName'] as String?,
    jobFitScore: (json['jobFitScore'] as num?)?.toInt(),
    requirementMatches:
        (json['requirementMatches'] as List<dynamic>? ?? const [])
            .map((e) => JobRequirementMatch.fromJson(e as Map<String, dynamic>))
            .toList(),
    keyStrengths: _stringList(json['keyStrengths']),
    gapAnalysis: _stringList(json['gapAnalysis']),
    tailoringTips: _stringList(json['tailoringTips']),
    chargedCredits: (json['chargedCredits'] as num?)?.toInt(),
  );

  static List<String> _stringList(Object? raw) =>
      (raw as List<dynamic>? ?? const []).map((e) => e.toString()).toList();

  final int overallScore;
  final String summary;
  final List<CvReviewComment> comments;
  final bool fromCache;
  final String modelVersion;
  final int? reviewLevel;
  final int? jobId;
  final String? jobTitle;
  final String? companyName;
  final int? jobFitScore;
  final List<JobRequirementMatch> requirementMatches;
  final List<String> keyStrengths;
  final List<String> gapAnalysis;
  final List<String> tailoringTips;
  final int? chargedCredits;

  bool get isJobFit => reviewLevel == 3 || requirementMatches.isNotEmpty;

  @override
  List<Object?> get props => [
    overallScore,
    summary,
    comments,
    fromCache,
    modelVersion,
    reviewLevel,
    jobId,
    jobTitle,
    companyName,
    jobFitScore,
    requirementMatches,
    keyStrengths,
    gapAnalysis,
    tailoringTips,
    chargedCredits,
  ];
}

class CvReviewQuota extends Equatable {
  const CvReviewQuota({
    required this.usedToday,
    required this.remaining,
    required this.maxDaily,
  });

  factory CvReviewQuota.fromJson(Map<String, dynamic> json) => CvReviewQuota(
    usedToday: (json['usedToday'] as num?)?.toInt() ?? 0,
    remaining: (json['remaining'] as num?)?.toInt() ?? 0,
    maxDaily: (json['maxDaily'] as num?)?.toInt() ?? 0,
  );

  final int usedToday;
  final int remaining;
  final int maxDaily;

  @override
  List<Object?> get props => [usedToday, remaining, maxDaily];
}
