import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/features/security/data/models/account_session_model.dart';
import 'package:intervue_flutter/features/security/data/models/two_factor_setup_model.dart';
import 'package:intervue_flutter/features/security/data/models/two_factor_status_model.dart';

sealed class SecurityState extends Equatable {
  const SecurityState();

  @override
  List<Object?> get props => [];
}

class SecurityInitial extends SecurityState {
  const SecurityInitial();
}

class SecurityLoading extends SecurityState {
  const SecurityLoading();
}

class SecurityLoaded extends SecurityState {
  const SecurityLoaded({
    required this.status,
    this.sessions = const [],
    this.setupData,
    this.actionMessage,
    this.actionError,
    this.isSubmittingAction = false,
  });

  final TwoFactorStatusModel status;
  final List<AccountSessionModel> sessions;
  final TwoFactorSetupModel? setupData;
  final String? actionMessage;
  final String? actionError;
  final bool isSubmittingAction;

  SecurityLoaded copyWith({
    TwoFactorStatusModel? status,
    List<AccountSessionModel>? sessions,
    TwoFactorSetupModel? setupData,
    String? actionMessage,
    String? actionError,
    bool? isSubmittingAction,
    bool clearSetup = false,
    bool clearAction = false,
  }) => SecurityLoaded(
    status: status ?? this.status,
    sessions: sessions ?? this.sessions,
    setupData: clearSetup ? null : (setupData ?? this.setupData),
    actionMessage: clearAction ? null : (actionMessage ?? this.actionMessage),
    actionError: clearAction ? null : (actionError ?? this.actionError),
    isSubmittingAction: isSubmittingAction ?? this.isSubmittingAction,
  );

  @override
  List<Object?> get props => [
    status,
    sessions,
    setupData,
    actionMessage,
    actionError,
    isSubmittingAction,
  ];
}

class SecurityError extends SecurityState {
  const SecurityError(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
