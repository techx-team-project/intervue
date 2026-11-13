import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_enums.dart';

class MockInterviewSummary extends Equatable {
  const MockInterviewSummary({
    required this.id,
    required this.targetRole,
    required this.seniorityLevel,
    required this.focusArea,
    required this.questionCount,
    required this.currentQuestionIndex,
    required this.status,
    this.overallScore,
    this.createdAt,
  });

  factory MockInterviewSummary.fromJson(
    Map<String, dynamic> json,
  ) => MockInterviewSummary(
    id: (json['id'] as num).toInt(),
    targetRole: json['targetRole'] as String? ?? '',
    seniorityLevel: json['seniorityLevel'] as String? ?? '',
    focusArea: MockInterviewFocusArea.fromValue(json['focusArea'] as String?),
    questionCount: (json['questionCount'] as num?)?.toInt() ?? 0,
    currentQuestionIndex: (json['currentQuestionIndex'] as num?)?.toInt() ?? 0,
    status: MockInterviewStatus.fromValue(json['status'] as String?),
    overallScore: (json['overallScore'] as num?)?.toInt(),
    createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '')?.toLocal(),
  );

  final int id;
  final String targetRole;
  final String seniorityLevel;
  final MockInterviewFocusArea focusArea;
  final int questionCount;
  final int currentQuestionIndex;
  final MockInterviewStatus status;
  final int? overallScore;
  final DateTime? createdAt;

  bool get isCompleted => status == MockInterviewStatus.completed;

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
    createdAt,
  ];
}
