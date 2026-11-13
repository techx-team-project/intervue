part of 'resume_review_cubit.dart';

enum ResumeReviewStatus { idle, reviewing, success, failure }

class ResumeReviewState extends Equatable {
  const ResumeReviewState({
    this.status = ResumeReviewStatus.idle,
    this.quota,
    this.credits,
    this.resumes = const [],
    this.jobs = const [],
    this.review,
    this.errorMessage,
    this.errorCode,
    this.isToppingUp = false,
  });

  final ResumeReviewStatus status;
  final CvReviewQuota? quota;
  final CandidateCreditSummary? credits;
  final List<CandidateResumeModel> resumes;
  final List<JobEntity> jobs;
  final CvReview? review;
  final String? errorMessage;
  final String? errorCode;
  final bool isToppingUp;

  bool get isReviewing => status == ResumeReviewStatus.reviewing;

  int get creditBalance => credits?.currentBalance ?? 0;

  ResumeReviewState copyWith({
    ResumeReviewStatus? status,
    CvReviewQuota? quota,
    CandidateCreditSummary? credits,
    List<CandidateResumeModel>? resumes,
    List<JobEntity>? jobs,
    CvReview? review,
    String? errorMessage,
    String? errorCode,
    bool? isToppingUp,
    bool clearReview = false,
    bool clearError = false,
  }) {
    return ResumeReviewState(
      status: status ?? this.status,
      quota: quota ?? this.quota,
      credits: credits ?? this.credits,
      resumes: resumes ?? this.resumes,
      jobs: jobs ?? this.jobs,
      review: clearReview ? null : review ?? this.review,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
      errorCode: clearError ? null : errorCode ?? this.errorCode,
      isToppingUp: isToppingUp ?? this.isToppingUp,
    );
  }

  @override
  List<Object?> get props => [
    status,
    quota,
    credits,
    resumes,
    jobs,
    review,
    errorMessage,
    errorCode,
    isToppingUp,
  ];
}
