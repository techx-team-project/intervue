import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_detail.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_summary.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/start_mock_interview_request.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/submit_answer_result.dart';

class MockInterviewRemoteDataSource {
  MockInterviewRemoteDataSource(this._client);

  static const Duration _aiTimeout = Duration(seconds: 90);

  final ApiClient _client;

  Future<MockInterviewDetail> startSession(
    StartMockInterviewRequest request,
  ) async {
    final data = await _client.post(
      ApiEndpoints.mockInterviews,
      data: request.toJson(),
      receiveTimeout: _aiTimeout,
    );
    return MockInterviewDetail.fromJson(_asMap(data));
  }

  Future<List<MockInterviewSummary>> listHistory() async {
    final data = await _client.get(ApiEndpoints.mockInterviews);
    if (data is! List<dynamic>) {
      throw const ServerException('Invalid interview history data');
    }
    return data
        .map((e) => MockInterviewSummary.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<MockInterviewDetail> getSessionDetail(int id) async {
    final data = await _client.get(ApiEndpoints.mockInterview(id));
    return MockInterviewDetail.fromJson(_asMap(data));
  }

  Future<SubmitAnswerResult> submitAnswer({
    required int sessionId,
    required int questionId,
    required String answer,
  }) async {
    final data = await _client.post(
      ApiEndpoints.mockInterviewAnswer(sessionId, questionId),
      data: {'answer': answer},
      receiveTimeout: _aiTimeout,
    );
    return SubmitAnswerResult.fromJson(_asMap(data));
  }

  Future<SubmitAnswerResult> submitFollowUp({
    required int sessionId,
    required int questionId,
    required String followUpAnswer,
  }) async {
    final data = await _client.post(
      ApiEndpoints.mockInterviewFollowUp(sessionId, questionId),
      data: {'followUpAnswer': followUpAnswer},
      receiveTimeout: _aiTimeout,
    );
    return SubmitAnswerResult.fromJson(_asMap(data));
  }

  Map<String, dynamic> _asMap(dynamic data) {
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Invalid AI interview data');
    }
    return data;
  }
}
