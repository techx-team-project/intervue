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
        'name': current.name ?? 'Ứng viên',
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
              ? 'Đã bật chế độ tìm việc. Nhà tuyển dụng có thể tiếp cận bạn!'
              : 'Đã tắt chế độ tìm việc.',
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
          actionMessage: 'Thêm kinh nghiệm làm việc thành công!',
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
          actionMessage: 'Đã xóa kinh nghiệm làm việc.',
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
          actionMessage: 'Thêm học vấn thành công!',
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
          actionMessage: 'Đã xóa thông tin học vấn.',
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
        CandidateProfileLoaded(
          profile: updated,
          actionMessage: 'Thêm kỹ năng thành công!',
        ),
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
          actionMessage: 'Đã xóa kỹ năng.',
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
          actionMessage: 'Thêm dự án thành công!',
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
          actionMessage: 'Đã xóa dự án.',
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
          actionMessage: 'Thêm chứng chỉ thành công!',
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
          actionMessage: 'Đã xóa chứng chỉ.',
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
          actionMessage: 'Thêm ngoại ngữ thành công!',
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
          actionMessage: 'Đã xóa ngoại ngữ.',
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
          actionMessage: 'Cập nhật thông tin hồ sơ thành công!',
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
          actionMessage: 'Cập nhật ảnh đại diện thành công!',
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
          actionMessage: 'Đã gỡ ảnh đại diện.',
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
