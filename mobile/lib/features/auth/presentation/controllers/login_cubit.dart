import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/auth/data/models/login_request.dart';
import 'package:intervue_flutter/features/auth/data/models/two_factor_challenge_request.dart';
import 'package:intervue_flutter/features/auth/data/repositories/auth_repository_impl.dart';

part 'login_state.dart';

class LoginCubit extends Cubit<LoginState> {
  LoginCubit(this._repository) : super(const LoginInitial());

  final AuthRepositoryImpl _repository;

  Future<void> login({required String email, required String password}) async {
    emit(const LoginLoading());
    try {
      final response = await _repository.login(
        LoginRequest(email: email, password: password),
      );
      final tempToken = response.tempToken;
      if (response.requiresTwoFactor &&
          tempToken != null &&
          tempToken.isNotEmpty) {
        emit(LoginRequiresTwoFactor(tempToken: tempToken));
        return;
      }
      emit(const LoginSuccess());
    } catch (e) {
      emit(LoginFailure(Failure.fromException(e).message));
    }
  }

  Future<void> verifyTwoFactor({
    required String tempToken,
    required String code,
    bool trustDevice = false,
  }) async {
    emit(LoginRequiresTwoFactor(tempToken: tempToken, isSubmitting: true));
    try {
      await _repository.verifyTwoFactor(
        TwoFactorChallengeRequest(
          tempToken: tempToken,
          code: code.trim(),
          trustDevice: trustDevice,
        ),
      );
      emit(const LoginSuccess());
    } catch (e) {
      emit(
        LoginRequiresTwoFactor(
          tempToken: tempToken,
          errorMessage: Failure.fromException(e).message,
        ),
      );
    }
  }

  void cancelTwoFactor() => emit(const LoginInitial());
}
