import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/profile/data/repositories/profile_repository_impl.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/candidate_profile_state.dart';

class CandidateProfileCubit extends Cubit<CandidateProfileState> {
  CandidateProfileCubit(this._repo, this._authBloc)
    : super(const CandidateProfileInitial()) {
    _authSubscription = _authBloc.stream.listen(_onAuthChanged);
    _onAuthChanged(_authBloc.state);
  }

  final ProfileRepositoryImpl _repo;
  final AuthBloc _authBloc;
  late final StreamSubscription<AuthState> _authSubscription;

  void _onAuthChanged(AuthState authState) {
    switch (authState) {
      case AuthAuthenticated():
        if (state is CandidateProfileInitial ||
            state is CandidateProfileError) {
          unawaited(loadProfile());
        }
      case AuthUnauthenticated():
        emit(const CandidateProfileInitial());
      case AuthUnknown():
        break;
    }
  }

  Future<void> loadProfile({bool silent = false}) async {
    if (_authBloc.state is! AuthAuthenticated) {
      emit(const CandidateProfileInitial());
      return;
    }
    if (!silent) {
      emit(const CandidateProfileLoading());
    }

    try {
      final profile = await _repo.fetchCandidateProfile();
      if (_authBloc.state is AuthAuthenticated) {
        emit(CandidateProfileLoaded(profile: profile));
      }
    } catch (e) {
      if (_authBloc.state is AuthAuthenticated) {
        emit(CandidateProfileError(Failure.fromException(e).message));
      }
    }
  }

  @override
  Future<void> close() {
    unawaited(_authSubscription.cancel());
    return super.close();
  }

  Future<void> toggleJobSearchStatus(bool isSeeking) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    final current = state.profile;
    final newStatus = isSeeking ? 'ACTIVELY_LOOKING' : 'NOT_LOOKING';

    try {
      final updateData = <String, dynamic>{
        'name': current.name ?? 'Candidate',
        'headline': current.headline ?? '',
        'desiredRole': current.desiredRole ?? 'Software Engineer',
        'jobSearchStatus': newStatus,
        'showPersonalDetails': true,
        'searchableByRecruiters': isSeeking,
        'salaryNegotiable': true,
      };

      final updated = await _repo.updateCandidateProfile(updateData);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: isSeeking
              ? 'Open to work is on. Recruiters can reach you!'
              : 'Open to work is off.',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> addExperience(Map<String, dynamic> data) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.addExperience(data);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Work experience added!',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> deleteExperience(int id) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.deleteExperience(id);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Work experience deleted.',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> addEducation(Map<String, dynamic> data) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.addEducation(data);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Education added!',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> deleteEducation(int id) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.deleteEducation(id);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Education deleted.',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> addSkill(Map<String, dynamic> data) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.addSkill(data);
      emit(
        CandidateProfileLoaded(profile: updated, actionMessage: 'Skill added!'),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> deleteSkill(int id) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.deleteSkill(id);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Skill deleted.',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> addProject(Map<String, dynamic> data) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.addProject(data);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Project added!',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> deleteProject(int id) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.deleteProject(id);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Project deleted.',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> addCertification(Map<String, dynamic> data) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.addCertification(data);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Certification added!',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> deleteCertification(int id) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.deleteCertification(id);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Certification deleted.',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> addLanguage(Map<String, dynamic> data) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.addLanguage(data);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Language added!',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> deleteLanguage(int id) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.deleteLanguage(id);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Language deleted.',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> updateProfile(Map<String, dynamic> body) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.updateCandidateProfile(body);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Profile updated successfully!',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> uploadAvatar(String filePath) async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.uploadAvatar(filePath);
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Avatar updated successfully!',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> removeAvatar() async {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;

    try {
      final updated = await _repo.removeAvatar();
      emit(
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Avatar removed.',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  void clearAction() {
    final state = this.state;
    if (state is! CandidateProfileLoaded) return;
    emit(state.copyWith(clearAction: true));
  }
}
