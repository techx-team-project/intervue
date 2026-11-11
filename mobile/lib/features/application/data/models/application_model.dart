import 'package:equatable/equatable.dart';

class ApplicationCvModel extends Equatable {
  const ApplicationCvModel({required this.fileName, this.fileSizeBytes = 0});

  factory ApplicationCvModel.fromJson(Map<String, dynamic> json) =>
      ApplicationCvModel(
        fileName: json['fileName'] as String? ?? 'CV.pdf',
        fileSizeBytes: (json['fileSizeBytes'] as num?)?.toInt() ?? 0,
      );

  Map<String, dynamic> toJson() => {
    'fileName': fileName,
    'fileSizeBytes': fileSizeBytes,
  };

  final String fileName;
  final int fileSizeBytes;

  @override
  List<Object?> get props => [fileName, fileSizeBytes];
}

class ApplicationAnswerModel extends Equatable {
  const ApplicationAnswerModel({
    required this.questionId,
    this.prompt,
    required this.answer,
  });

  factory ApplicationAnswerModel.fromJson(Map<String, dynamic> json) =>
      ApplicationAnswerModel(
        questionId: (json['questionId'] as num).toInt(),
        prompt: json['prompt'] as String?,
        answer: json['answer'] as String? ?? '',
      );

  Map<String, dynamic> toJson() => {
    'questionId': questionId,
    if (prompt != null) 'prompt': prompt,
    'answer': answer,
  };

  final int questionId;
  final String? prompt;
  final String answer;

  @override
  List<Object?> get props => [questionId, prompt, answer];
}

class ApplicationHistoryModel extends Equatable {
  const ApplicationHistoryModel({
    this.from,
    required this.to,
    this.actorType,
    this.at,
  });

  factory ApplicationHistoryModel.fromJson(Map<String, dynamic> json) =>
      ApplicationHistoryModel(
        from: json['from'] as String?,
        to: json['to'] as String? ?? '',
        actorType: json['actorType'] as String?,
        at: json['at'] != null ? DateTime.tryParse(json['at'] as String) : null,
      );

  Map<String, dynamic> toJson() => {
    if (from != null) 'from': from,
    'to': to,
    if (actorType != null) 'actorType': actorType,
    if (at != null) 'at': at?.toIso8601String(),
  };

  final String? from;
  final String to;
  final String? actorType;
  final DateTime? at;

  @override
  List<Object?> get props => [from, to, actorType, at];
}

class ApplicationModel extends Equatable {
  const ApplicationModel({
    required this.id,
    required this.status,
    required this.jobId,
    required this.jobTitle,
    this.companyId,
    this.companyName,
    this.resumeId,
    this.cv,
    this.coverLetter,
    this.answers = const [],
    this.history = const [],
    this.submittedAt,
    this.viewedAt,
    this.updatedAt,
  });

  factory ApplicationModel.fromJson(
    Map<String, dynamic> json,
  ) => ApplicationModel(
    id: (json['id'] as num).toInt(),
    status: json['status'] as String? ?? 'DRAFT',
    jobId: (json['jobId'] as num).toInt(),
    jobTitle: json['jobTitle'] as String? ?? '',
    companyId: (json['companyId'] as num?)?.toInt(),
    companyName: json['companyName'] as String?,
    resumeId: (json['resumeId'] as num?)?.toInt(),
    cv: json['cv'] != null
        ? ApplicationCvModel.fromJson(json['cv'] as Map<String, dynamic>)
        : null,
    coverLetter: json['coverLetter'] as String?,
    answers:
        (json['answers'] as List<dynamic>?)
            ?.map(
              (e) => ApplicationAnswerModel.fromJson(e as Map<String, dynamic>),
            )
            .toList() ??
        const [],
    history:
        (json['history'] as List<dynamic>?)
            ?.map(
              (e) =>
                  ApplicationHistoryModel.fromJson(e as Map<String, dynamic>),
            )
            .toList() ??
        const [],
    submittedAt: json['submittedAt'] != null
        ? DateTime.tryParse(json['submittedAt'] as String)
        : null,
    viewedAt: json['viewedAt'] != null
        ? DateTime.tryParse(json['viewedAt'] as String)
        : null,
    updatedAt: json['updatedAt'] != null
        ? DateTime.tryParse(json['updatedAt'] as String)
        : null,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'status': status,
    'jobId': jobId,
    'jobTitle': jobTitle,
    if (companyId != null) 'companyId': companyId,
    if (companyName != null) 'companyName': companyName,
    if (resumeId != null) 'resumeId': resumeId,
    if (cv != null) 'cv': cv?.toJson(),
    if (coverLetter != null) 'coverLetter': coverLetter,
    'answers': answers.map((e) => e.toJson()).toList(),
    'history': history.map((e) => e.toJson()).toList(),
    if (submittedAt != null) 'submittedAt': submittedAt?.toIso8601String(),
    if (viewedAt != null) 'viewedAt': viewedAt?.toIso8601String(),
    if (updatedAt != null) 'updatedAt': updatedAt?.toIso8601String(),
  };

  final int id;
  final String status;
  final int jobId;
  final String jobTitle;
  final int? companyId;
  final String? companyName;
  final int? resumeId;
  final ApplicationCvModel? cv;
  final String? coverLetter;
  final List<ApplicationAnswerModel> answers;
  final List<ApplicationHistoryModel> history;
  final DateTime? submittedAt;
  final DateTime? viewedAt;
  final DateTime? updatedAt;

  bool get isDraft => status == 'DRAFT';
  bool get isApplied => status == 'APPLIED';
  bool get isViewed => status == 'VIEWED';
  bool get isInReview => status == 'IN_REVIEW';
  bool get isInterview => status == 'INTERVIEW';
  bool get isOffer => status == 'OFFER';
  bool get isHired => status == 'HIRED';
  bool get isRejected => status == 'REJECTED';
  bool get isWithdrawn => status == 'WITHDRAWN';
  bool get isJobClosed => status == 'JOB_CLOSED';

  bool get canWithdraw => isApplied || isViewed || isInReview || isInterview;
  bool get canReapply => isWithdrawn;

  @override
  List<Object?> get props => [
    id,
    status,
    jobId,
    jobTitle,
    companyId,
    companyName,
    resumeId,
    cv,
    coverLetter,
    answers,
    history,
    submittedAt,
    viewedAt,
    updatedAt,
  ];
}
