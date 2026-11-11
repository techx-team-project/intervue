import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/auth/data/models/register_request.dart';
import 'package:intervue_flutter/features/auth/data/repositories/auth_repository_impl.dart';

part 'register_state.dart';

class RegisterCubit extends Cubit<RegisterState> {
  RegisterCubit(this._repository) : super(const RegisterInitial());

  final AuthRepositoryImpl _repository;

  Future<void> register({
    required String name,
    required String email,
    required String password,
    required String confirmPassword,
  }) async {
    emit(const RegisterLoading());
    try {
      await _repository.register(
        RegisterRequest(
          name: name,
          email: email,
          password: password,
          confirmPassword: confirmPassword,
        ),
      );
      emit(const RegisterSuccess());
    } catch (e) {
      emit(RegisterFailure(Failure.fromException(e).message));
    }
  }
}
