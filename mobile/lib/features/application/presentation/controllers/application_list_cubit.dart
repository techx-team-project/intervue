import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/application/data/repositories/application_repository_impl.dart';
import 'package:intervue_flutter/features/application/presentation/controllers/application_list_state.dart';

class ApplicationListCubit extends Cubit<ApplicationListState> {
  ApplicationListCubit(this._repo) : super(const ApplicationListInitial());

  final ApplicationRepositoryImpl _repo;

  Future<void> loadApplications({bool isRefresh = false}) async {
    if (!isRefresh) {
      emit(const ApplicationListLoading());
    }

    try {
      final list = await _repo.getApplications();
      emit(ApplicationListLoaded(applications: list));
    } catch (e) {
      emit(ApplicationListError(Failure.fromException(e).message));
    }
  }

  void setFilter(String filterKey) {
    final state = this.state;
    if (state is! ApplicationListLoaded) return;
    emit(state.copyWith(selectedFilter: filterKey, clearAction: true));
  }

  Future<void> withdraw(int applicationId) async {
    final state = this.state;
    if (state is! ApplicationListLoaded) return;

    try {
      await _repo.withdraw(applicationId);
      final refreshed = await _repo.getApplications();
      emit(
        ApplicationListLoaded(
          applications: refreshed,
          selectedFilter: state.selectedFilter,
          actionMessage: 'Application withdrawn.',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> reapply(int applicationId, int resumeId) async {
    final state = this.state;
    if (state is! ApplicationListLoaded) return;

    try {
      await _repo.reapply(applicationId, resumeId);
      final refreshed = await _repo.getApplications();
      emit(
        ApplicationListLoaded(
          applications: refreshed,
          selectedFilter: state.selectedFilter,
          actionMessage: 'Reapplied successfully!',
        ),
      );
    } catch (e) {
      emit(state.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  void clearAction() {
    final state = this.state;
    if (state is! ApplicationListLoaded) return;
    emit(state.copyWith(clearAction: true));
  }
}
