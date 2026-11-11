part of 'auth_bloc.dart';

sealed class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

/// Kiểm tra token đã lưu khi mở app.
final class AuthStarted extends AuthEvent {
  const AuthStarted();
}

/// Đăng nhập thành công (token đã được lưu bởi repository).
final class AuthSignedIn extends AuthEvent {
  const AuthSignedIn();
}

final class AuthSignedOut extends AuthEvent {
  const AuthSignedOut();
}

/// Refresh token thất bại, buộc đăng nhập lại.
final class AuthSessionExpired extends AuthEvent {
  const AuthSessionExpired();
}
