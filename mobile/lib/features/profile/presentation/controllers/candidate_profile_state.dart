import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_profile_model.dart';

sealed class CandidateProfileState extends Equatable {
  const CandidateProfileState();

  @override
  List<Object?> get props => [];
}

final class CandidateProfileInitial extends CandidateProfileState {
  const CandidateProfileInitial();
}

final class CandidateProfileLoading extends CandidateProfileState {
  const CandidateProfileLoading();
}

final class CandidateProfileLoaded extends CandidateProfileState {
  const CandidateProfileLoaded({
    required this.profile,
    this.actionMessage,
    this.actionError,
  });

  final CandidateProfileModel profile;
  final String? actionMessage;
  final String? actionError;

  CandidateProfileLoaded copyWith({
    CandidateProfileModel? profile,
    String? actionMessage,
    String? actionError,
    bool clearAction = false,
  }) {
    return CandidateProfileLoaded(
      profile: profile ?? this.profile,
      actionMessage: clearAction ? null : (actionMessage ?? this.actionMessage),
      actionError: clearAction ? null : (actionError ?? this.actionError),
    );
  }

  @override
  List<Object?> get props => [profile, actionMessage, actionError];
}

final class CandidateProfileError extends CandidateProfileState {
  const CandidateProfileError(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
