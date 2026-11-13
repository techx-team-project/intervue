import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_detail.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_question.dart';

class SubmitAnswerResult extends Equatable {
  const SubmitAnswerResult({
    required this.questionId,
    required this.questionOrder,
    required this.needsFollowUp,
    required this.sessionCompleted,
    this.followUpQuestion,
    this.feedback,
    this.score,
    this.idealAnswer,
    this.nextQuestion,
    this.completedSession,
  });

  factory SubmitAnswerResult.fromJson(Map<String, dynamic> json) {
    final next = json['nextQuestion'];
    final completed = json['completedSession'];
    return SubmitAnswerResult(
      questionId: (json['questionId'] as num).toInt(),
      questionOrder: (json['questionOrder'] as num?)?.toInt() ?? 0,
      needsFollowUp: json['needsFollowUp'] as bool? ?? false,
      sessionCompleted: json['sessionCompleted'] as bool? ?? false,
      followUpQuestion: json['followUpQuestion'] as String?,
      feedback: json['feedback'] as String?,
      score: (json['score'] as num?)?.toInt(),
      idealAnswer: json['idealAnswer'] as String?,
      nextQuestion: next is Map<String, dynamic>
          ? MockInterviewQuestion.fromJson(next)
          : null,
      completedSession: completed is Map<String, dynamic>
          ? MockInterviewDetail.fromJson(completed)
          : null,
    );
  }

  factory SubmitAnswerResult.pendingFollowUp(MockInterviewQuestion question) =>
      SubmitAnswerResult(
        questionId: question.id,
        questionOrder: question.questionOrder,
        needsFollowUp: true,
        sessionCompleted: false,
        followUpQuestion: question.followUpQuestion,
        feedback: question.feedback,
        score: question.score,
        idealAnswer: question.idealAnswer,
      );

  final int questionId;
  final int questionOrder;
  final bool needsFollowUp;
  final bool sessionCompleted;
  final String? followUpQuestion;
  final String? feedback;
  final int? score;
  final String? idealAnswer;
  final MockInterviewQuestion? nextQuestion;
  final MockInterviewDetail? completedSession;

  @override
  List<Object?> get props => [
    questionId,
    questionOrder,
    needsFollowUp,
    sessionCompleted,
    followUpQuestion,
    feedback,
    score,
    idealAnswer,
    nextQuestion,
    completedSession,
  ];
}
