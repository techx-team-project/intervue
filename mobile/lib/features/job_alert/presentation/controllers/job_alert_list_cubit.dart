import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/job_alert/data/models/create_job_alert_request.dart';
import 'package:intervue_flutter/features/job_alert/data/models/job_alert_summary_model.dart';
import 'package:intervue_flutter/features/job_alert/data/repositories/job_alert_repository_impl.dart';
import 'package:intervue_flutter/features/job_alert/presentation/controllers/job_alert_list_state.dart';

class JobAlertListCubit extends Cubit<JobAlertListState> {
  JobAlertListCubit(this._repo) : super(const JobAlertListInitial());

  final JobAlertRepositoryImpl _repo;

  Future<void> loadAlerts({bool silent = false}) async {
    if (!silent) {
      emit(const JobAlertListLoading());
    }

    try {
      final results = await Future.wait([
        _repo.getAlerts(),
        _repo.getSummary().catchError((_) => const JobAlertSummaryModel()),
      ]);

      final alerts = results[0] as List<dynamic>;
      final summary = results[1] as JobAlertSummaryModel;

      emit(JobAlertListLoaded(alerts: alerts.cast(), summary: summary));
    } catch (e) {
      emit(JobAlertListError(Failure.fromException(e).message));
    }
  }

  Future<bool> createAlert(CreateJobAlertRequest request) async {
    try {
      final created = await _repo.createAlert(request);
      final current = state;
      if (current is JobAlertListLoaded) {
        final updatedAlerts = [created, ...current.alerts];
        final updatedSummary = JobAlertSummaryModel(
          totalAlerts: current.summary.totalAlerts + 1,
          activeAlerts:
              current.summary.activeAlerts + (created.isActive ? 1 : 0),
          pausedAlerts:
              current.summary.pausedAlerts + (created.isActive ? 0 : 1),
          totalDeliveries: current.summary.totalDeliveries,
        );
        emit(
          current.copyWith(
            alerts: updatedAlerts,
            summary: updatedSummary,
            actionMessage: 'Job alert created successfully!',
          ),
        );
      } else {
        await loadAlerts();
      }
      return true;
    } catch (e) {
      final current = state;
      if (current is JobAlertListLoaded) {
        emit(current.copyWith(actionError: Failure.fromException(e).message));
      } else {
        emit(JobAlertListError(Failure.fromException(e).message));
      }
      return false;
    }
  }

  Future<void> toggleAlert(int id) async {
    final current = state;
    if (current is! JobAlertListLoaded) return;

    try {
      final updated = await _repo.toggleAlert(id);
      final updatedList = current.alerts.map((a) {
        return a.id == id ? updated : a;
      }).toList();

      final activeCount = updatedList.where((a) => a.isActive).length;
      final pausedCount = updatedList.length - activeCount;

      emit(
        current.copyWith(
          alerts: updatedList,
          summary: JobAlertSummaryModel(
            totalAlerts: updatedList.length,
            activeAlerts: activeCount,
            pausedAlerts: pausedCount,
            totalDeliveries: current.summary.totalDeliveries,
          ),
          actionMessage: updated.isActive
              ? 'Alert enabled: ${updated.title}'
              : 'Alert paused: ${updated.title}',
        ),
      );
    } catch (e) {
      emit(current.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> deleteAlert(int id) async {
    final current = state;
    if (current is! JobAlertListLoaded) return;

    try {
      await _repo.deleteAlert(id);
      final updatedList = current.alerts.where((a) => a.id != id).toList();
      final activeCount = updatedList.where((a) => a.isActive).length;
      final pausedCount = updatedList.length - activeCount;

      emit(
        current.copyWith(
          alerts: updatedList,
          summary: JobAlertSummaryModel(
            totalAlerts: updatedList.length,
            activeAlerts: activeCount,
            pausedAlerts: pausedCount,
            totalDeliveries: current.summary.totalDeliveries,
          ),
          actionMessage: 'Job alert deleted.',
        ),
      );
    } catch (e) {
      emit(current.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  Future<void> sendTestEmail(int id) async {
    final current = state;
    if (current is! JobAlertListLoaded) return;

    try {
      final sent = await _repo.sendTestEmail(id);
      emit(
        current.copyWith(
          actionMessage: sent
              ? 'Test email with matching jobs sent! Please check your inbox.'
              : 'No job fully matches the criteria to send a test.',
        ),
      );
    } catch (e) {
      emit(current.copyWith(actionError: Failure.fromException(e).message));
    }
  }

  void clearAction() {
    final current = state;
    if (current is! JobAlertListLoaded) return;
    emit(current.copyWith(clearAction: true));
  }
}
