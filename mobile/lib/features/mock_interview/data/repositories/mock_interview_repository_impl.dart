import 'package:intervue_flutter/features/mock_interview/data/datasources/mock_interview_remote_data_source.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_detail.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_summary.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/start_mock_interview_request.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/submit_answer_result.dart';

class MockInterviewRepositoryImpl {
  MockInterviewRepositoryImpl(this._remote);

  final MockInterviewRemoteDataSource _remote;

  Future<MockInterviewDetail> startSession(StartMockInterviewRequest request) =>
      _remote.startSession(request);

  Future<List<MockInterviewSummary>> listHistory() => _remote.listHistory();

  Future<MockInterviewDetail> getSessionDetail(int id) =>
      _remote.getSessionDetail(id);

  Future<SubmitAnswerResult> submitAnswer({
    required int sessionId,
    required int questionId,
    required String answer,
  }) => _remote.submitAnswer(
    sessionId: sessionId,
    questionId: questionId,
    answer: answer,
  );

  Future<SubmitAnswerResult> submitFollowUp({
    required int sessionId,
    required int questionId,
    required String followUpAnswer,
  }) => _remote.submitFollowUp(
    sessionId: sessionId,
    questionId: questionId,
    followUpAnswer: followUpAnswer,
  );
}
