import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/company/data/repositories/company_repository_impl.dart';
import 'package:intervue_flutter/features/company/presentation/controllers/company_detail_state.dart';

class CompanyDetailCubit extends Cubit<CompanyDetailState> {
  CompanyDetailCubit(this._repo) : super(const CompanyDetailInitial());

  final CompanyRepositoryImpl _repo;

  Future<void> loadCompany(int id) async {
    emit(const CompanyDetailLoading());
    try {
      final company = await _repo.getCompanyDetail(id);
      emit(CompanyDetailLoaded(company));
    } catch (e) {
      emit(CompanyDetailError(Failure.fromException(e).message));
    }
  }
}
