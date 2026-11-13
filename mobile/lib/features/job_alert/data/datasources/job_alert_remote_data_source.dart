import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/features/job_alert/data/models/create_job_alert_request.dart';
import 'package:intervue_flutter/features/job_alert/data/models/job_alert_model.dart';
import 'package:intervue_flutter/features/job_alert/data/models/job_alert_summary_model.dart';

class JobAlertRemoteDataSource {
  JobAlertRemoteDataSource(this._client);

  final ApiClient _client;

  Future<List<JobAlertModel>> getAlerts() async {
    final response = await _client.get(ApiEndpoints.candidateJobAlerts);

    final items = switch (response) {
      List<dynamic>() => response,
      {'content': final List<dynamic> content} => content,
      {'items': final List<dynamic> items} => items,
      _ => throw const ServerException('Invalid job alert data'),
    };

    return items
        .map((e) => JobAlertModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<JobAlertSummaryModel> getSummary() async {
    final response = await _client.get(ApiEndpoints.candidateJobAlertSummary);

    if (response is! Map<String, dynamic>) {
      throw const ServerException('Unable to load job alert statistics');
    }

    return JobAlertSummaryModel.fromJson(response);
  }

  Future<JobAlertModel> createAlert(CreateJobAlertRequest request) async {
    final response = await _client.post(
      ApiEndpoints.candidateJobAlerts,
      data: request.toJson(),
    );

    if (response is! Map<String, dynamic>) {
      throw const ServerException('Unable to create the job alert');
    }

    return JobAlertModel.fromJson(response);
  }

  Future<JobAlertModel> toggleAlert(int id) async {
    final response = await _client.patch(
      ApiEndpoints.candidateJobAlertToggle(id),
    );

    if (response is! Map<String, dynamic>) {
      throw const ServerException('Unable to change the job alert status');
    }

    return JobAlertModel.fromJson(response);
  }

  Future<void> deleteAlert(int id) async {
    await _client.delete(ApiEndpoints.candidateJobAlertDetail(id));
  }

  Future<bool> sendTestEmail(int id) async {
    final response = await _client.post(
      ApiEndpoints.candidateJobAlertTestSend(id),
    );

    if (response is bool) {
      return response;
    }
    return true;
  }
}
