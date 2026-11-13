import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/features/application/data/models/application_model.dart';
import 'package:intervue_flutter/features/application/data/models/application_summary_model.dart';
import 'package:intervue_flutter/features/application/data/models/apply_form_model.dart';
import 'package:intervue_flutter/features/application/data/models/save_application_request.dart';

class ApplicationRemoteDataSource {
  ApplicationRemoteDataSource(this._client);

  final ApiClient _client;

  Future<List<ApplicationSummaryModel>> getApplications({
    String? status,
    int? jobId,
    int page = 0,
    int size = 20,
  }) async {
    final queryParams = <String, dynamic>{
      'page': page,
      'size': size,
      if (status != null && status.isNotEmpty) 'status': status,
      'jobId': ?jobId,
    };

    final response = await _client.get(
      ApiEndpoints.candidateApplications,
      queryParameters: queryParams,
    );

    final items = switch (response) {
      List<dynamic>() => response,
      {'content': final List<dynamic> content} => content,
      {'items': final List<dynamic> items} => items,
      _ => throw const ServerException('Invalid application data'),
    };

    return items
        .map((e) => ApplicationSummaryModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<ApplyFormModel> getForm(int jobId) async {
    final response = await _client.get(
      ApiEndpoints.candidateApplicationForm(jobId),
    );

    if (response is! Map<String, dynamic>) {
      throw const ServerException('Unable to load the application form');
    }

    return ApplyFormModel.fromJson(response);
  }

  Future<ApplicationModel> getDetail(int applicationId) async {
    final response = await _client.get(
      ApiEndpoints.candidateApplicationDetail(applicationId),
    );

    if (response is! Map<String, dynamic>) {
      throw const ServerException('Unable to load application details');
    }

    return ApplicationModel.fromJson(response);
  }

  Future<ApplicationModel> saveDraft(SaveApplicationRequest request) async {
    final response = await _client.put(
      ApiEndpoints.candidateApplicationDraft,
      data: request.toJson(),
    );

    if (response is! Map<String, dynamic>) {
      throw const ServerException('Unable to save the draft');
    }

    return ApplicationModel.fromJson(response);
  }

  Future<ApplicationModel> submit(SaveApplicationRequest request) async {
    final response = await _client.post(
      ApiEndpoints.candidateApplications,
      data: request.toJson(),
    );

    if (response is! Map<String, dynamic>) {
      throw const ServerException('Unable to submit the application');
    }

    return ApplicationModel.fromJson(response);
  }

  Future<ApplicationModel> withdraw(int applicationId) async {
    final response = await _client.post(
      ApiEndpoints.candidateApplicationWithdraw(applicationId),
    );

    if (response is! Map<String, dynamic>) {
      throw const ServerException('Unable to withdraw the application');
    }

    return ApplicationModel.fromJson(response);
  }

  Future<ApplicationModel> reapply(int applicationId, int resumeId) async {
    final response = await _client.post(
      ApiEndpoints.candidateApplicationReapply(applicationId),
      data: {'resumeId': resumeId},
    );

    if (response is! Map<String, dynamic>) {
      throw const ServerException('Unable to reapply');
    }

    return ApplicationModel.fromJson(response);
  }
}
