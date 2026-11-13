import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_enums.dart';

class StartMockInterviewRequest {
  const StartMockInterviewRequest({
    required this.targetRole,
    required this.seniorityLevel,
    required this.focusArea,
    required this.questionCount,
    this.resumeId,
  });

  final int? resumeId;
  final String targetRole;
  final String seniorityLevel;
  final MockInterviewFocusArea focusArea;
  final int questionCount;

  Map<String, dynamic> toJson() => {
    if (resumeId != null) 'resumeId': resumeId,
    'targetRole': targetRole,
    'seniorityLevel': seniorityLevel,
    'focusArea': focusArea.value,
    'questionCount': questionCount,
  };
}
