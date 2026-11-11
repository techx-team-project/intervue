class SaveApplicationAnswer {
  const SaveApplicationAnswer({required this.questionId, required this.answer});

  final int questionId;
  final String answer;

  Map<String, dynamic> toJson() => {'questionId': questionId, 'answer': answer};
}

class SaveApplicationRequest {
  const SaveApplicationRequest({
    required this.jobId,
    this.resumeId,
    this.coverLetter,
    this.answers = const [],
  });

  final int jobId;
  final int? resumeId;
  final String? coverLetter;
  final List<SaveApplicationAnswer> answers;

  Map<String, dynamic> toJson() => {
    'jobId': jobId,
    if (resumeId != null) 'resumeId': resumeId,
    if (coverLetter != null && coverLetter!.trim().isNotEmpty)
      'coverLetter': coverLetter!.trim(),
    'answers': answers.map((e) => e.toJson()).toList(),
  };
}
