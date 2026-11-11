import 'dart:async';

import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/auth/data/models/user_model.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/profile/data/repositories/profile_repository_impl.dart';

part 'profile_state.dart';

class ProfileCubit extends Cubit<ProfileState> {
  ProfileCubit(this._repository, this._authBloc)
    : super(const ProfileInitial()) {
    _authSubscription = _authBloc.stream.listen(_onAuthChanged);
    _onAuthChanged(_authBloc.state);
  }

  final ProfileRepositoryImpl _repository;
  final AuthBloc _authBloc;
  late final StreamSubscription<AuthState> _authSubscription;

  void _onAuthChanged(AuthState authState) {
    switch (authState) {
      case AuthAuthenticated():
        if (state is ProfileInitial || state is ProfileFailure) {
          unawaited(load());
        }
      case AuthUnauthenticated():
        emit(const ProfileInitial());
      case AuthUnknown():
        break;
    }
  }

  Future<void> load() async {
    emit(const ProfileLoading());
    try {
      final user = await _repository.fetchCurrentUser();
      if (_authBloc.state is AuthAuthenticated) emit(ProfileLoaded(user));
    } catch (e) {
      if (_authBloc.state is AuthAuthenticated) {
        emit(ProfileFailure(Failure.fromException(e).message));
      }
    }
  }

  @override
  Future<void> close() {
    unawaited(_authSubscription.cancel());
    return super.close();
  }
}
