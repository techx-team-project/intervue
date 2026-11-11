import 'package:dio/dio.dart';
import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_resume_model.dart';
import 'package:intervue_flutter/features/resume/data/models/cv_review.dart';

class ResumeRemoteDataSource {
  ResumeRemoteDataSource(this._client);

  final ApiClient _client;

  Future<List<CandidateResumeModel>> getCandidateCvs() async {
    final data = await _client.get(ApiEndpoints.candidateCvs);
    if (data is! List<dynamic>) {
      throw const ServerException('Dữ liệu danh sách CV không hợp lệ');
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
      throw const ServerException('Dữ liệu tải lên CV không hợp lệ');
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
      throw const ServerException('Dữ liệu đổi tên CV không hợp lệ');
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
  }) async {
    final form = FormData.fromMap({
      'file': MultipartFile.fromBytes(
        bytes,
        filename: fileName,
        contentType: DioMediaType('application', 'pdf'),
      ),
      if (targetPosition != null && targetPosition.isNotEmpty)
        'targetPosition': targetPosition,
    });
    final data = await _client.post(
      ApiEndpoints.cvReviewUpload,
      data: form,
      receiveTimeout: const Duration(seconds: 120),
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Dữ liệu chấm CV không hợp lệ');
    }
    return CvReview.fromJson(data);
  }

  Future<CvReviewQuota> getQuota() async {
    final data = await _client.get(ApiEndpoints.cvReviewQuota);
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Dữ liệu hạn mức không hợp lệ');
    }
    return CvReviewQuota.fromJson(data);
  }
}
