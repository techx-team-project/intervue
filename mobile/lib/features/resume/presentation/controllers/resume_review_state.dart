part of 'resume_review_cubit.dart';

enum ResumeReviewStatus { idle, uploading, success, failure }

class ResumeReviewState extends Equatable {
  const ResumeReviewState({
    this.status = ResumeReviewStatus.idle,
    this.quota,
    this.review,
    this.fileName,
    this.errorMessage,
  });

  final ResumeReviewStatus status;
  final CvReviewQuota? quota;
  final CvReview? review;
  final String? fileName;
  final String? errorMessage;

  bool get isUploading => status == ResumeReviewStatus.uploading;

  ResumeReviewState copyWith({
    ResumeReviewStatus? status,
    CvReviewQuota? quota,
    CvReview? review,
    String? fileName,
    String? errorMessage,
    bool clearReview = false,
    bool clearError = false,
  }) {
    return ResumeReviewState(
      status: status ?? this.status,
      quota: quota ?? this.quota,
      review: clearReview ? null : review ?? this.review,
      fileName: fileName ?? this.fileName,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
    );
  }

  @override
  List<Object?> get props => [status, quota, review, fileName, errorMessage];
}
