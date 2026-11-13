import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/features/company/data/models/public_company_model.dart';

class CompanyRemoteDataSource {
  CompanyRemoteDataSource(this._client);

  final ApiClient _client;

  Future<PublicCompanyModel> getCompanyDetail(int id) async {
    final response = await _client.get(
      ApiEndpoints.companyDetail(id),
      skipAuth: true,
    );

    if (response is! Map<String, dynamic>) {
      throw const ServerException('Unable to load company information');
    }

    return PublicCompanyModel.fromJson(response);
  }
}
