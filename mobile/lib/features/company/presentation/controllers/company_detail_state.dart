import 'package:equatable/equatable.dart';
import 'package:intervue_flutter/features/company/data/models/public_company_model.dart';

sealed class CompanyDetailState extends Equatable {
  const CompanyDetailState();

  @override
  List<Object?> get props => [];
}

final class CompanyDetailInitial extends CompanyDetailState {
  const CompanyDetailInitial();
}

final class CompanyDetailLoading extends CompanyDetailState {
  const CompanyDetailLoading();
}

final class CompanyDetailLoaded extends CompanyDetailState {
  const CompanyDetailLoaded(this.company);

  final PublicCompanyModel company;

  @override
  List<Object?> get props => [company];
}

final class CompanyDetailError extends CompanyDetailState {
  const CompanyDetailError(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
