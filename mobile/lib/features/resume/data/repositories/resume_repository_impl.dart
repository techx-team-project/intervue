import 'package:intervue_flutter/features/resume/data/datasources/resume_remote_data_source.dart';
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
  }) => _remote.reviewCv(
    bytes: bytes,
    fileName: fileName,
    targetPosition: targetPosition,
  );

  Future<CvReviewQuota> fetchQuota() => _remote.getQuota();
}
