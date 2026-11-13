import 'package:intervue_flutter/features/resume/data/datasources/resume_remote_data_source.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_credits.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_resume_model.dart';
import 'package:intervue_flutter/features/resume/data/models/cv_review.dart';

class ResumeRepositoryImpl {
  ResumeRepositoryImpl(this._remote);

  final ResumeRemoteDataSource _remote;

  Future<List<CandidateResumeModel>> getCandidateCvs() =>
      _remote.getCandidateCvs();

  Future<CandidateResumeModel> uploadCandidateCv({
    required List<int> bytes,
    required String fileName,
  }) => _remote.uploadCandidateCv(bytes: bytes, fileName: fileName);

  Future<CandidateResumeModel> renameCandidateCv({
    required int id,
    required String newFileName,
  }) => _remote.renameCandidateCv(id: id, newFileName: newFileName);

  Future<void> deleteCandidateCv(int id) => _remote.deleteCandidateCv(id);

  Future<CvReview> reviewCv({
    required List<int> bytes,
    required String fileName,
    String? targetPosition,
    int? jobId,
  }) => _remote.reviewCv(
    bytes: bytes,
    fileName: fileName,
    targetPosition: targetPosition,
    jobId: jobId,
  );

  Future<CvReview> reviewSavedCv({
    required int level,
    int? resumeId,
    String? cvText,
    String? targetPosition,
    int? jobId,
  }) => _remote.reviewSavedCv(
    level: level,
    resumeId: resumeId,
    cvText: cvText,
    targetPosition: targetPosition,
    jobId: jobId,
  );

  Future<CandidateCreditSummary> fetchCredits() => _remote.getCredits();

  Future<CandidateCreditSummary> topupCredits(int amount) =>
      _remote.topupCredits(amount);

  Future<CvReviewQuota> fetchQuota() => _remote.getQuota();
}
