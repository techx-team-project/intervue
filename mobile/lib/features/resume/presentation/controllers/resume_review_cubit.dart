import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/constants/app_constants.dart';
import 'package:intervue_flutter/core/errors/ai_failure_message.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/core/utils/file_helpers.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';
import 'package:intervue_flutter/features/job/domain/repositories/i_job_repository.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_credits.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_resume_model.dart';
import 'package:intervue_flutter/features/resume/data/models/cv_review.dart';
import 'package:intervue_flutter/features/resume/data/repositories/resume_repository_impl.dart';

part 'resume_review_state.dart';

class ResumeReviewCubit extends Cubit<ResumeReviewState> {
  ResumeReviewCubit(this._repository, this._jobRepository)
    : super(const ResumeReviewState());

  static const int paidLevel = 3;
  static const String insufficientCreditsCode = 'INSUFFICIENT_CREDITS';
  static const int _jobSampleSize = 30;

  final ResumeRepositoryImpl _repository;
  final IJobRepository _jobRepository;

  Future<void> loadInitial() =>
      Future.wait([loadQuota(), loadCredits(), loadResumes(), loadJobs()]);

  Future<void> loadQuota() async {
    try {
      emit(state.copyWith(quota: await _repository.fetchQuota()));
    } catch (_) {
      return;
    }
  }

  Future<void> loadCredits() async {
    try {
      emit(state.copyWith(credits: await _repository.fetchCredits()));
    } catch (_) {
      return;
    }
  }

  Future<void> loadResumes() async {
    try {
      emit(state.copyWith(resumes: await _repository.getCandidateCvs()));
    } catch (_) {
      return;
    }
  }

  Future<void> loadJobs() async {
    try {
      final jobs = await _jobRepository.fetchJobs(size: _jobSampleSize);
      emit(state.copyWith(jobs: jobs));
    } catch (_) {
      return;
    }
  }

  Future<void> reviewFile({
    required List<int> bytes,
    required String fileName,
    required int sizeBytes,
    required int level,
    String? targetPosition,
    int? jobId,
  }) async {
    if (FileHelpers.extensionOf(fileName) != 'pdf') {
      return _fail('Only PDF CVs can be scored.');
    }
    if (sizeBytes > AppConstants.maxCvSizeBytes) {
      final maxSize = FileHelpers.formatSize(AppConstants.maxCvSizeBytes);
      return _fail('The file exceeds $maxSize, please choose a smaller file.');
    }
    await _run(
      level,
      () => _repository.reviewCv(
        bytes: bytes,
        fileName: fileName,
        targetPosition: level == 2 ? targetPosition?.trim() : null,
        jobId: level == paidLevel ? jobId : null,
      ),
    );
  }

  Future<void> reviewSaved({
    required int level,
    int? resumeId,
    String? cvText,
    String? targetPosition,
    int? jobId,
  }) => _run(
    level,
    () => _repository.reviewSavedCv(
      level: level,
      resumeId: resumeId,
      cvText: cvText?.trim(),
      targetPosition: level == 2 ? targetPosition?.trim() : null,
      jobId: level == paidLevel ? jobId : null,
    ),
  );

  Future<bool> topup(int amount) async {
    if (state.isToppingUp) return false;
    emit(state.copyWith(isToppingUp: true));
    try {
      final credits = await _repository.topupCredits(amount);
      emit(state.copyWith(credits: credits, isToppingUp: false));
      return true;
    } catch (e) {
      emit(
        state.copyWith(
          isToppingUp: false,
          status: ResumeReviewStatus.failure,
          errorMessage: aiFailureMessage(Failure.fromException(e)),
        ),
      );
      return false;
    }
  }

  void reset() => emit(
    state.copyWith(
      status: ResumeReviewStatus.idle,
      clearReview: true,
      clearError: true,
    ),
  );

  void clearError() =>
      emit(state.copyWith(status: ResumeReviewStatus.idle, clearError: true));

  void _fail(String message) => emit(
    state.copyWith(
      status: ResumeReviewStatus.failure,
      errorMessage: message,
      clearReview: true,
    ),
  );

  Future<void> _run(int level, Future<CvReview> Function() review) async {
    emit(
      state.copyWith(
        status: ResumeReviewStatus.reviewing,
        clearReview: true,
        clearError: true,
      ),
    );
    try {
      final result = await review();
      emit(state.copyWith(status: ResumeReviewStatus.success, review: result));
      await (level == paidLevel ? loadCredits() : loadQuota());
    } catch (e) {
      emit(
        state.copyWith(
          status: ResumeReviewStatus.failure,
          errorMessage: _messageFor(e),
          errorCode: e is ServerException ? e.code : null,
        ),
      );
    }
  }

  static String _messageFor(Object error) {
    if (error is ServerException) {
      switch (error.code) {
        case 'AI_USER_QUOTA_EXCEEDED':
          return 'You have used all free CV reviews for today. Please come back tomorrow.';
        case insufficientCreditsCode:
          return 'You do not have enough credits for a Level 3 review. Please top up.';
        case 'CV_TEXT_NOT_READABLE':
          return 'Unable to read the CV content. Please use a text-based PDF (not a scanned image).';
      }
    }
    if (error is AppException) {
      switch (error.statusCode) {
        case 404:
          return 'You need to complete your candidate profile before scoring a CV. Save your profile and try again.';
        case 400:
          return 'We could not review this CV. Please check the file or text and try again.';
      }
    }
    return aiFailureMessage(Failure.fromException(error));
  }
}
