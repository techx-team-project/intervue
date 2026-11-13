import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_enums.dart';

class StartMockInterviewRequest {
  const StartMockInterviewRequest({
    required this.targetRole,
    required this.seniorityLevel,
    required this.focusArea,
    required this.questionCount,
    this.cvBytes,
    this.cvFileName,
  });

  final List<int>? cvBytes;
  final String? cvFileName;
  final String targetRole;
  final String seniorityLevel;
  final MockInterviewFocusArea focusArea;
  final int questionCount;

  Map<String, dynamic> toJson() => {
    'targetRole': targetRole,
    'seniorityLevel': seniorityLevel,
    'focusArea': focusArea.value,
    'questionCount': questionCount,
  };

  bool get hasCv => cvBytes != null && cvFileName != null;
}
