import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/features/job_alert/data/models/job_alert_model.dart';
import 'package:intervue_flutter/features/job_alert/data/models/job_alert_summary_model.dart';

sealed class JobAlertListState extends Equatable {
  const JobAlertListState();

  @override
  List<Object?> get props => [];
}

final class JobAlertListInitial extends JobAlertListState {
  const JobAlertListInitial();
}

final class JobAlertListLoading extends JobAlertListState {
  const JobAlertListLoading();
}

final class JobAlertListLoaded extends JobAlertListState {
  const JobAlertListLoaded({
    required this.alerts,
    this.summary = const JobAlertSummaryModel(),
    this.actionMessage,
    this.actionError,
  });

  final List<JobAlertModel> alerts;
  final JobAlertSummaryModel summary;
  final String? actionMessage;
  final String? actionError;

  List<JobAlertModel> get activeAlerts =>
      alerts.where((a) => a.isActive).toList();

  List<JobAlertModel> get pausedAlerts =>
      alerts.where((a) => !a.isActive).toList();

  JobAlertListLoaded copyWith({
    List<JobAlertModel>? alerts,
    JobAlertSummaryModel? summary,
    String? actionMessage,
    String? actionError,
    bool clearAction = false,
  }) => JobAlertListLoaded(
    alerts: alerts ?? this.alerts,
    summary: summary ?? this.summary,
    actionMessage: clearAction ? null : (actionMessage ?? this.actionMessage),
    actionError: clearAction ? null : (actionError ?? this.actionError),
  );

  @override
  List<Object?> get props => [alerts, summary, actionMessage, actionError];
}

final class JobAlertListError extends JobAlertListState {
  const JobAlertListError(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
