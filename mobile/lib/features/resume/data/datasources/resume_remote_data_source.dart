import 'package:dio/dio.dart';
import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_credits.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_resume_model.dart';
import 'package:intervue_flutter/features/resume/data/models/cv_review.dart';

class ResumeRemoteDataSource {
  ResumeRemoteDataSource(this._client);

  static const Duration _aiTimeout = Duration(seconds: 120);

  final ApiClient _client;

  Future<List<CandidateResumeModel>> getCandidateCvs() async {
    final data = await _client.get(ApiEndpoints.candidateCvs);
    if (data is! List<dynamic>) {
      throw const ServerException('Invalid CV list data');
    }
    return data
        .map((e) => CandidateResumeModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<CandidateResumeModel> uploadCandidateCv({
    required List<int> bytes,
    required String fileName,
  }) async {
    final form = FormData.fromMap({
      'file': MultipartFile.fromBytes(
        bytes,
        filename: fileName,
        contentType: DioMediaType('application', 'pdf'),
      ),
    });
    final data = await _client.post(
      ApiEndpoints.candidateCvs,
      data: form,
      receiveTimeout: const Duration(seconds: 60),
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Invalid CV upload data');
    }
    return CandidateResumeModel.fromJson(data);
  }

  Future<CandidateResumeModel> renameCandidateCv({
    required int id,
    required String newFileName,
  }) async {
    final data = await _client.patch(
      ApiEndpoints.candidateCv(id),
      data: {'fileName': newFileName},
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Invalid CV rename data');
    }
    return CandidateResumeModel.fromJson(data);
  }

  Future<void> deleteCandidateCv(int id) async {
    await _client.delete(ApiEndpoints.candidateCv(id));
  }

  Future<CvReview> reviewCv({
    required List<int> bytes,
    required String fileName,
    String? targetPosition,
    int? jobId,
  }) async {
    final form = FormData.fromMap({
      'file': MultipartFile.fromBytes(
        bytes,
        filename: fileName,
        contentType: DioMediaType('application', 'pdf'),
      ),
      if (targetPosition != null && targetPosition.isNotEmpty)
        'targetPosition': targetPosition,
      'jobId': ?jobId,
    });
    final data = await _client.post(
      ApiEndpoints.cvReviewUpload,
      data: form,
      receiveTimeout: _aiTimeout,
    );
    return CvReview.fromJson(_asMap(data, 'Invalid CV review data'));
  }

  Future<CvReview> reviewSavedCv({
    required int level,
    int? resumeId,
    String? cvText,
    String? targetPosition,
    int? jobId,
  }) async {
    final data = await _client.post(
      ApiEndpoints.cvReviews,
      data: {
        'resumeId': ?resumeId,
        if (cvText != null && cvText.isNotEmpty) 'cvText': cvText,
        if (targetPosition != null && targetPosition.isNotEmpty)
          'targetPosition': targetPosition,
        'jobId': ?jobId,
        'level': level,
      },
      receiveTimeout: _aiTimeout,
    );
    return CvReview.fromJson(_asMap(data, 'Invalid CV review data'));
  }

  Future<CandidateCreditSummary> getCredits() async {
    final data = await _client.get(ApiEndpoints.candidateCredits);
    return CandidateCreditSummary.fromJson(_asMap(data, 'Invalid credit data'));
  }

  Future<CandidateCreditSummary> topupCredits(int amount) async {
    final data = await _client.post(
      ApiEndpoints.candidateCreditsTopup,
      data: {'amount': amount},
    );
    return CandidateCreditSummary.fromJson(_asMap(data, 'Invalid credit data'));
  }

  Map<String, dynamic> _asMap(dynamic data, String errorMessage) {
    if (data is! Map<String, dynamic>) throw ServerException(errorMessage);
    return data;
  }

  Future<CvReviewQuota> getQuota() async {
    final data = await _client.get(ApiEndpoints.cvReviewQuota);
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Invalid quota data');
    }
    return CvReviewQuota.fromJson(data);
  }
}
