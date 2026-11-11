import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/security/data/repositories/security_repository_impl.dart';
import 'package:intervue_flutter/features/security/presentation/controllers/security_state.dart';

class SecurityCubit extends Cubit<SecurityState> {
  SecurityCubit(this._repo) : super(const SecurityInitial());

  final SecurityRepositoryImpl _repo;

  Future<void> loadSecurityData() async {
    emit(const SecurityLoading());
    try {
      final status = await _repo.fetch2FaStatus();
      final sessions = await _repo.fetchSessions();
      emit(SecurityLoaded(status: status, sessions: sessions));
    } catch (e) {
      emit(SecurityError(Failure.fromException(e).message));
    }
  }

  Future<void> initiate2FaSetup() async {
    final state = this.state;
    if (state is! SecurityLoaded) return;

    emit(state.copyWith(isSubmittingAction: true, clearAction: true));
    try {
      final setup = await _repo.initiate2FaSetup();
      emit(state.copyWith(setupData: setup, isSubmittingAction: false));
    } catch (e) {
      emit(
        state.copyWith(
          actionError: Failure.fromException(e).message,
          isSubmittingAction: false,
        ),
      );
    }
  }

  Future<void> confirm2Fa(String code) async {
    final state = this.state;
    if (state is! SecurityLoaded) return;

    emit(state.copyWith(isSubmittingAction: true, clearAction: true));
    try {
      final newStatus = await _repo.confirm2Fa(code);
      emit(
        state.copyWith(
          status: newStatus,
          clearSetup: true,
          actionMessage: 'Kích hoạt xác thực 2 bước (2FA) thành công!',
          isSubmittingAction: false,
        ),
      );
    } catch (e) {
      emit(
        state.copyWith(
          actionError: Failure.fromException(e).message,
          isSubmittingAction: false,
        ),
      );
    }
  }

  Future<void> disable2Fa({String? password}) async {
    final state = this.state;
    if (state is! SecurityLoaded) return;

    emit(state.copyWith(isSubmittingAction: true, clearAction: true));
    try {
      await _repo.disable2Fa(password: password);
      final newStatus = await _repo.fetch2FaStatus();
      emit(
        state.copyWith(
          status: newStatus,
          clearSetup: true,
          actionMessage: 'Đã tắt xác thực 2 bước.',
          isSubmittingAction: false,
        ),
      );
    } catch (e) {
      emit(
        state.copyWith(
          actionError: Failure.fromException(e).message,
          isSubmittingAction: false,
        ),
      );
    }
  }

  Future<void> changePassword({
    required String currentPassword,
    required String password,
    required String confirmPassword,
  }) async {
    final state = this.state;
    if (state is! SecurityLoaded) return;

    emit(state.copyWith(isSubmittingAction: true, clearAction: true));
    try {
      await _repo.changePassword(
        currentPassword: currentPassword,
        password: password,
        confirmPassword: confirmPassword,
      );
      emit(
        state.copyWith(
          actionMessage: 'Đổi mật khẩu tài khoản thành công!',
          isSubmittingAction: false,
        ),
      );
    } catch (e) {
      emit(
        state.copyWith(
          actionError: Failure.fromException(e).message,
          isSubmittingAction: false,
        ),
      );
    }
  }

  Future<void> revokeSession(int id) async {
    final state = this.state;
    if (state is! SecurityLoaded) return;

    try {
      await _repo.revokeSession(id);
      final updatedSessions = await _repo.fetchSessions();
      emit(
        state.copyWith(
          sessions: updatedSessions,
          actionMessage: 'Đã ngắt phiên đăng nhập thiết bị.',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  void cancelSetup() {
    final state = this.state;
    if (state is! SecurityLoaded) return;
    emit(state.copyWith(clearSetup: true));
  }

  void clearAction() {
    final state = this.state;
    if (state is! SecurityLoaded) return;
    emit(state.copyWith(clearAction: true));
  }
}
