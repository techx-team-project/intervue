import 'dart:async';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/resume/data/repositories/resume_repository_impl.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/candidate_cv_state.dart';

class CandidateCvCubit extends Cubit<CandidateCvState> {
  CandidateCvCubit(this._repository, this._authBloc)
    : super(const CandidateCvInitial()) {
    _authSubscription = _authBloc.stream.listen(_onAuthChanged);
    _onAuthChanged(_authBloc.state);
  }

  final ResumeRepositoryImpl _repository;
  final AuthBloc _authBloc;
  late final StreamSubscription<AuthState> _authSubscription;

  void _onAuthChanged(AuthState authState) {
    switch (authState) {
      case AuthAuthenticated():
        if (state is CandidateCvInitial || state is CandidateCvError) {
          unawaited(loadCvs());
        }
      case AuthUnauthenticated():
        emit(const CandidateCvInitial());
      case AuthUnknown():
        break;
    }
  }

  Future<void> loadCvs({bool silent = false}) async {
    if (_authBloc.state is! AuthAuthenticated) {
      emit(const CandidateCvInitial());
      return;
    }
    if (!silent) {
      emit(const CandidateCvLoading());
    }
    try {
      final cvs = await _repository.getCandidateCvs();
      if (_authBloc.state is AuthAuthenticated) {
        emit(CandidateCvLoaded(cvs: cvs));
      }
    } on AppException catch (e) {
      if (_authBloc.state is AuthAuthenticated) {
        emit(CandidateCvError(e.message));
      }
    } catch (_) {
      if (_authBloc.state is AuthAuthenticated) {
        emit(const CandidateCvError('Không thể tải danh sách CV'));
      }
    }
  }

  @override
  Future<void> close() {
    unawaited(_authSubscription.cancel());
    return super.close();
  }

  Future<bool> uploadCv({
    required List<int> bytes,
    required String fileName,
  }) async {
    final current = state;
    if (current is CandidateCvLoaded) {
      emit(current.copyWith(isUploading: true));
    } else {
      emit(const CandidateCvLoading());
    }

    try {
      await _repository.uploadCandidateCv(bytes: bytes, fileName: fileName);
      final updated = await _repository.getCandidateCvs();
      emit(
        CandidateCvLoaded(
          cvs: updated,
          actionMessage: 'Tải lên CV thành công!',
        ),
      );
      return true;
    } on AppException catch (e) {
      if (current is CandidateCvLoaded) {
        emit(current.copyWith(isUploading: false, actionMessage: e.message));
      } else {
        emit(CandidateCvError(e.message));
      }
      return false;
    } catch (_) {
      const msg =
          'Tải lên CV thất bại. Vui lòng kiểm tra dung lượng (tối đa 5MB) và định dạng PDF';
      if (current is CandidateCvLoaded) {
        emit(current.copyWith(isUploading: false, actionMessage: msg));
      } else {
        emit(const CandidateCvError(msg));
      }
      return false;
    }
  }

  Future<bool> renameCv({required int id, required String newName}) async {
    try {
      await _repository.renameCandidateCv(id: id, newFileName: newName);
      final updated = await _repository.getCandidateCvs();
      emit(
        CandidateCvLoaded(
          cvs: updated,
          actionMessage: 'Đổi tên CV thành công!',
        ),
      );
      return true;
    } on AppException catch (e) {
      final current = state;
      if (current is CandidateCvLoaded) {
        emit(current.copyWith(actionMessage: e.message));
      }
      return false;
    } catch (_) {
      return false;
    }
  }

  Future<bool> deleteCv(int id) async {
    try {
      await _repository.deleteCandidateCv(id);
      final updated = await _repository.getCandidateCvs();
      emit(
        CandidateCvLoaded(cvs: updated, actionMessage: 'Đã xóa CV thành công!'),
      );
      return true;
    } on AppException catch (e) {
      final current = state;
      if (current is CandidateCvLoaded) {
        emit(current.copyWith(actionMessage: e.message));
      }
      return false;
    } catch (_) {
      return false;
    }
  }
}
