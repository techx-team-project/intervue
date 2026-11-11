part of 'login_cubit.dart';

sealed class LoginState extends Equatable {
  const LoginState();

  @override
  List<Object?> get props => [];
}

final class LoginInitial extends LoginState {
  const LoginInitial();
}

final class LoginLoading extends LoginState {
  const LoginLoading();
}

final class LoginRequiresTwoFactor extends LoginState {
  const LoginRequiresTwoFactor({
    required this.tempToken,
    this.isSubmitting = false,
    this.errorMessage,
  });

  final String tempToken;
  final bool isSubmitting;
  final String? errorMessage;

  @override
  List<Object?> get props => [tempToken, isSubmitting, errorMessage];
}

final class LoginSuccess extends LoginState {
  const LoginSuccess();
}

final class LoginFailure extends LoginState {
  const LoginFailure(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
