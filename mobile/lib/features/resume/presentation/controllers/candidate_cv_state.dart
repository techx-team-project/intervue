import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_resume_model.dart';

sealed class CandidateCvState extends Equatable {
  const CandidateCvState();

  @override
  List<Object?> get props => [];
}

final class CandidateCvInitial extends CandidateCvState {
  const CandidateCvInitial();
}

final class CandidateCvLoading extends CandidateCvState {
  const CandidateCvLoading();
}

final class CandidateCvLoaded extends CandidateCvState {
  const CandidateCvLoaded({
    required this.cvs,
    this.isUploading = false,
    this.actionMessage,
  });

  final List<CandidateResumeModel> cvs;
  final bool isUploading;
  final String? actionMessage;

  CandidateCvLoaded copyWith({
    List<CandidateResumeModel>? cvs,
    bool? isUploading,
    String? actionMessage,
  }) => CandidateCvLoaded(
    cvs: cvs ?? this.cvs,
    isUploading: isUploading ?? this.isUploading,
    actionMessage: actionMessage,
  );

  @override
  List<Object?> get props => [cvs, isUploading, actionMessage];
}

final class CandidateCvError extends CandidateCvState {
  const CandidateCvError(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
