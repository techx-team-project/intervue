import 'dart:async';

import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/network/session_expired_notifier.dart';
import 'package:intervue_flutter/features/auth/data/repositories/auth_repository_impl.dart';

part 'auth_event.dart';
part 'auth_state.dart';

/// Trạng thái phiên đăng nhập toàn app; router lắng nghe để chặn/mở route.
class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc({
    required AuthRepositoryImpl authRepository,
    required SessionExpiredNotifier sessionExpiredNotifier,
  }) : _repository = authRepository,
       super(const AuthUnknown()) {
    on<AuthStarted>(_onStarted);
    on<AuthSignedIn>((event, emit) => emit(const AuthAuthenticated()));
    on<AuthSignedOut>(_onSignedOut);
    on<AuthSessionExpired>(_onSessionExpired);

    _expiredSubscription = sessionExpiredNotifier.stream.listen(
      (_) => add(const AuthSessionExpired()),
    );
  }

  final AuthRepositoryImpl _repository;
  late final StreamSubscription<void> _expiredSubscription;

  Future<void> _onStarted(AuthStarted event, Emitter<AuthState> emit) async {
    final hasSession = await _repository.hasSession();
    emit(hasSession ? const AuthAuthenticated() : const AuthUnauthenticated());
  }

  Future<void> _onSignedOut(
    AuthSignedOut event,
    Emitter<AuthState> emit,
  ) async {
    await _repository.logout();
    emit(const AuthUnauthenticated());
  }

  Future<void> _onSessionExpired(
    AuthSessionExpired event,
    Emitter<AuthState> emit,
  ) async {
    await _repository.clearSession();
    emit(const AuthUnauthenticated(sessionExpired: true));
  }

  @override
  Future<void> close() {
    unawaited(_expiredSubscription.cancel());
    return super.close();
  }
}
