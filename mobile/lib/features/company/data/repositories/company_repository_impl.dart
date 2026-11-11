import 'package:intervue_flutter/features/company/data/datasources/company_remote_data_source.dart';
import 'package:intervue_flutter/features/company/data/models/public_company_model.dart';

class CompanyRepositoryImpl {
  CompanyRepositoryImpl(this._remote);

  final CompanyRemoteDataSource _remote;

  Future<PublicCompanyModel> getCompanyDetail(int id) =>
      _remote.getCompanyDetail(id);
}
