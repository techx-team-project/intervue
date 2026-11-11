import 'package:intervue_flutter/features/application/data/datasources/application_remote_data_source.dart';
import 'package:intervue_flutter/features/application/data/models/application_model.dart';
import 'package:intervue_flutter/features/application/data/models/application_summary_model.dart';
import 'package:intervue_flutter/features/application/data/models/apply_form_model.dart';
import 'package:intervue_flutter/features/application/data/models/save_application_request.dart';

class ApplicationRepositoryImpl {
  ApplicationRepositoryImpl(this._remote);

  final ApplicationRemoteDataSource _remote;

  Future<List<ApplicationSummaryModel>> getApplications({
    String? status,
    int? jobId,
    int page = 0,
    int size = 20,
  }) => _remote.getApplications(
    status: status,
    jobId: jobId,
    page: page,
    size: size,
  );

  Future<ApplyFormModel> getForm(int jobId) => _remote.getForm(jobId);

  Future<ApplicationModel> getDetail(int applicationId) =>
      _remote.getDetail(applicationId);

  Future<ApplicationModel> saveDraft(SaveApplicationRequest request) =>
      _remote.saveDraft(request);

  Future<ApplicationModel> submit(SaveApplicationRequest request) =>
      _remote.submit(request);

  Future<ApplicationModel> withdraw(int applicationId) =>
      _remote.withdraw(applicationId);

  Future<ApplicationModel> reapply(int applicationId, int resumeId) =>
      _remote.reapply(applicationId, resumeId);
}
