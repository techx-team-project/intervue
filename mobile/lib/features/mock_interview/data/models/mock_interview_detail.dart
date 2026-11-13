import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_enums.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_question.dart';

class MockInterviewDetail extends Equatable {
  const MockInterviewDetail({
    required this.id,
    required this.targetRole,
    required this.seniorityLevel,
    required this.focusArea,
    required this.questionCount,
    required this.currentQuestionIndex,
    required this.status,
    required this.questions,
    this.overallScore,
    this.overallFeedback,
    this.strengths = const [],
    this.improvements = const [],
  });

  factory MockInterviewDetail.fromJson(
    Map<String, dynamic> json,
  ) => MockInterviewDetail(
    id: (json['id'] as num).toInt(),
    targetRole: json['targetRole'] as String? ?? '',
    seniorityLevel: json['seniorityLevel'] as String? ?? '',
    focusArea: MockInterviewFocusArea.fromValue(json['focusArea'] as String?),
    questionCount: (json['questionCount'] as num?)?.toInt() ?? 0,
    currentQuestionIndex: (json['currentQuestionIndex'] as num?)?.toInt() ?? 0,
    status: MockInterviewStatus.fromValue(json['status'] as String?),
    overallScore: (json['overallScore'] as num?)?.toInt(),
    overallFeedback: json['overallFeedback'] as String?,
    strengths: _stringList(json['strengths']),
    improvements: _stringList(json['improvements']),
    questions: (json['questions'] as List<dynamic>? ?? const [])
        .map((e) => MockInterviewQuestion.fromJson(e as Map<String, dynamic>))
        .toList(),
  );

  static List<String> _stringList(Object? raw) =>
      (raw as List<dynamic>? ?? const []).map((e) => e.toString()).toList();

  final int id;
  final String targetRole;
  final String seniorityLevel;
  final MockInterviewFocusArea focusArea;
  final int questionCount;
  final int currentQuestionIndex;
  final MockInterviewStatus status;
  final int? overallScore;
  final String? overallFeedback;
  final List<String> strengths;
  final List<String> improvements;
  final List<MockInterviewQuestion> questions;

  bool get isCompleted => status == MockInterviewStatus.completed;

  MockInterviewQuestion? get currentQuestion =>
      currentQuestionIndex >= 0 && currentQuestionIndex < questions.length
      ? questions[currentQuestionIndex]
      : null;

  MockInterviewDetail copyWith({
    int? currentQuestionIndex,
    List<MockInterviewQuestion>? questions,
  }) => MockInterviewDetail(
    id: id,
    targetRole: targetRole,
    seniorityLevel: seniorityLevel,
    focusArea: focusArea,
    questionCount: questionCount,
    currentQuestionIndex: currentQuestionIndex ?? this.currentQuestionIndex,
    status: status,
    overallScore: overallScore,
    overallFeedback: overallFeedback,
    strengths: strengths,
    improvements: improvements,
    questions: questions ?? this.questions,
  );

  @override
  List<Object?> get props => [
    id,
    targetRole,
    seniorityLevel,
    focusArea,
    questionCount,
    currentQuestionIndex,
    status,
    overallScore,
    overallFeedback,
    strengths,
    improvements,
    questions,
  ];
}
