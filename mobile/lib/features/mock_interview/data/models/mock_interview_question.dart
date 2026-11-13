import 'package:equatable/equatable.dart';

class MockInterviewQuestion extends Equatable {
  const MockInterviewQuestion({
    required this.id,
    required this.questionOrder,
    required this.category,
    required this.questionText,
    this.candidateAnswer,
    this.followUpQuestion,
    this.followUpAnswer,
    this.feedback,
    this.score,
    this.idealAnswer,
  });

  factory MockInterviewQuestion.fromJson(Map<String, dynamic> json) =>
      MockInterviewQuestion(
        id: (json['id'] as num).toInt(),
        questionOrder: (json['questionOrder'] as num?)?.toInt() ?? 0,
        category: json['category'] as String? ?? '',
        questionText: json['questionText'] as String? ?? '',
        candidateAnswer: json['candidateAnswer'] as String?,
        followUpQuestion: json['followUpQuestion'] as String?,
        followUpAnswer: json['followUpAnswer'] as String?,
        feedback: json['feedback'] as String?,
        score: (json['score'] as num?)?.toInt(),
        idealAnswer: json['idealAnswer'] as String?,
      );

  final int id;
  final int questionOrder;
  final String category;
  final String questionText;
  final String? candidateAnswer;
  final String? followUpQuestion;
  final String? followUpAnswer;
  final String? feedback;
  final int? score;
  final String? idealAnswer;

  bool get hasPendingFollowUp =>
      candidateAnswer != null &&
      (followUpQuestion?.isNotEmpty ?? false) &&
      (followUpAnswer?.isEmpty ?? true);

  MockInterviewQuestion copyWith({
    String? candidateAnswer,
    String? followUpQuestion,
    String? followUpAnswer,
    String? feedback,
    int? score,
    String? idealAnswer,
  }) => MockInterviewQuestion(
    id: id,
    questionOrder: questionOrder,
    category: category,
    questionText: questionText,
    candidateAnswer: candidateAnswer ?? this.candidateAnswer,
    followUpQuestion: followUpQuestion ?? this.followUpQuestion,
    followUpAnswer: followUpAnswer ?? this.followUpAnswer,
    feedback: feedback ?? this.feedback,
    score: score ?? this.score,
    idealAnswer: idealAnswer ?? this.idealAnswer,
  );

  @override
  List<Object?> get props => [
    id,
    questionOrder,
    category,
    questionText,
    candidateAnswer,
    followUpQuestion,
    followUpAnswer,
    feedback,
    score,
    idealAnswer,
  ];
}
