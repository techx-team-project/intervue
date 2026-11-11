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

class CvReview extends Equatable {
  const CvReview({
    required this.overallScore,
    required this.summary,
    required this.comments,
    required this.fromCache,
  });

  factory CvReview.fromJson(Map<String, dynamic> json) => CvReview(
    overallScore: (json['overallScore'] as num?)?.toInt() ?? 0,
    summary: json['summary'] as String? ?? '',
    comments: (json['comments'] as List<dynamic>? ?? const [])
        .map((e) => CvReviewComment.fromJson(e as Map<String, dynamic>))
        .toList(),
    fromCache: json['fromCache'] as bool? ?? false,
  );

  final int overallScore;
  final String summary;
  final List<CvReviewComment> comments;
  final bool fromCache;

  @override
  List<Object?> get props => [overallScore, summary, comments, fromCache];
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
