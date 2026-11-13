import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/features/application/data/models/application_model.dart';
import 'package:intervue_flutter/features/application/data/models/apply_form_model.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_resume_model.dart';

sealed class ApplyJobState extends Equatable {
  const ApplyJobState();

  @override
  List<Object?> get props => [];
}

final class ApplyJobInitial extends ApplyJobState {
  const ApplyJobInitial();
}

final class ApplyJobLoading extends ApplyJobState {
  const ApplyJobLoading();
}

final class ApplyJobReady extends ApplyJobState {
  const ApplyJobReady({
    required this.form,
    this.resumes = const [],
    this.selectedResumeId,
    this.answers = const {},
    this.coverLetter = '',
    this.isSubmitting = false,
    this.isSavingDraft = false,
    this.actionError,
  });

  final ApplyFormModel form;
  final List<CandidateResumeModel> resumes;
  final int? selectedResumeId;
  final Map<int, String> answers;
  final String coverLetter;
  final bool isSubmitting;
  final bool isSavingDraft;
  final String? actionError;

  ApplyJobReady copyWith({
    ApplyFormModel? form,
    List<CandidateResumeModel>? resumes,
    int? selectedResumeId,
    Map<int, String>? answers,
    String? coverLetter,
    bool? isSubmitting,
    bool? isSavingDraft,
    String? actionError,
    bool clearActionError = false,
  }) {
    return ApplyJobReady(
      form: form ?? this.form,
      resumes: resumes ?? this.resumes,
      selectedResumeId: selectedResumeId ?? this.selectedResumeId,
      answers: answers ?? this.answers,
      coverLetter: coverLetter ?? this.coverLetter,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      isSavingDraft: isSavingDraft ?? this.isSavingDraft,
      actionError: clearActionError ? null : (actionError ?? this.actionError),
    );
  }

  @override
  List<Object?> get props => [
    form,
    resumes,
    selectedResumeId,
    answers,
    coverLetter,
    isSubmitting,
    isSavingDraft,
    actionError,
  ];
}

final class ApplyJobSuccess extends ApplyJobState {
  const ApplyJobSuccess({
    required this.application,
    this.isDraft = false,
    this.message = 'Applied successfully!',
  });

  final ApplicationModel application;
  final bool isDraft;
  final String message;

  @override
  List<Object?> get props => [application, isDraft, message];
}

final class ApplyJobFailure extends ApplyJobState {
  const ApplyJobFailure(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
