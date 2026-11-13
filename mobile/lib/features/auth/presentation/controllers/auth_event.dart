part of 'auth_bloc.dart';

sealed class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

/// Checks the stored token when the app opens.
final class AuthStarted extends AuthEvent {
  const AuthStarted();
}

/// Sign-in succeeded (the token was stored by the repository).
final class AuthSignedIn extends AuthEvent {
  const AuthSignedIn();
}

final class AuthSignedOut extends AuthEvent {
  const AuthSignedOut();
}

/// Token refresh failed, forcing a new sign-in.
final class AuthSessionExpired extends AuthEvent {
  const AuthSessionExpired();
}
