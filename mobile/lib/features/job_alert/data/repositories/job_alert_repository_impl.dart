import 'package:intervue_flutter/features/job_alert/data/datasources/job_alert_remote_data_source.dart';
import 'package:intervue_flutter/features/job_alert/data/models/create_job_alert_request.dart';
import 'package:intervue_flutter/features/job_alert/data/models/job_alert_model.dart';
import 'package:intervue_flutter/features/job_alert/data/models/job_alert_summary_model.dart';

class JobAlertRepositoryImpl {
  JobAlertRepositoryImpl(this._remoteDataSource);

  final JobAlertRemoteDataSource _remoteDataSource;

  Future<List<JobAlertModel>> getAlerts() => _remoteDataSource.getAlerts();

  Future<JobAlertSummaryModel> getSummary() => _remoteDataSource.getSummary();

  Future<JobAlertModel> createAlert(CreateJobAlertRequest request) =>
      _remoteDataSource.createAlert(request);

  Future<JobAlertModel> toggleAlert(int id) =>
      _remoteDataSource.toggleAlert(id);

  Future<void> deleteAlert(int id) => _remoteDataSource.deleteAlert(id);

  Future<bool> sendTestEmail(int id) => _remoteDataSource.sendTestEmail(id);
}
