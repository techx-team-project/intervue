part of 'auth_bloc.dart';

sealed class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

/// The stored token has not been checked yet (on splash).
final class AuthUnknown extends AuthState {
  const AuthUnknown();
}

final class AuthAuthenticated extends AuthState {
  const AuthAuthenticated();
}

final class AuthUnauthenticated extends AuthState {
  const AuthUnauthenticated({this.sessionExpired = false});

  final bool sessionExpired;

  @override
  List<Object?> get props => [sessionExpired];
}
