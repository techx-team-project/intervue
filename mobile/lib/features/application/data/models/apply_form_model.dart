import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/features/application/data/models/application_model.dart';
import 'package:intervue_flutter/features/application/data/models/screening_question_model.dart';

class ApplyFormModel extends Equatable {
  const ApplyFormModel({
    required this.jobId,
    required this.jobTitle,
    required this.companyName,
    required this.open,
    this.questions = const [],
    this.application,
  });

  factory ApplyFormModel.fromJson(Map<String, dynamic> json) => ApplyFormModel(
    jobId: (json['jobId'] as num).toInt(),
    jobTitle: json['jobTitle'] as String? ?? '',
    companyName: json['companyName'] as String? ?? '',
    open: json['open'] as bool? ?? true,
    questions:
        (json['questions'] as List<dynamic>?)
            ?.map(
              (e) => ScreeningQuestionModel.fromJson(e as Map<String, dynamic>),
            )
            .toList() ??
        const [],
    application: json['application'] != null
        ? ApplicationModel.fromJson(json['application'] as Map<String, dynamic>)
        : null,
  );

  Map<String, dynamic> toJson() => {
    'jobId': jobId,
    'jobTitle': jobTitle,
    'companyName': companyName,
    'open': open,
    'questions': questions.map((e) => e.toJson()).toList(),
    if (application != null) 'application': application?.toJson(),
  };

  final int jobId;
  final String jobTitle;
  final String companyName;
  final bool open;
  final List<ScreeningQuestionModel> questions;
  final ApplicationModel? application;

  bool get hasSubmittedApplication =>
      application != null && !application!.isDraft && !application!.isWithdrawn;

  @override
  List<Object?> get props => [
    jobId,
    jobTitle,
    companyName,
    open,
    questions,
    application,
  ];
}
