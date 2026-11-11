import 'package:intervue_flutter/features/cover_letter/data/datasources/cover_letter_remote_data_source.dart';
import 'package:intervue_flutter/features/cover_letter/data/models/cover_letter_result.dart';

class CoverLetterRepositoryImpl {
  CoverLetterRepositoryImpl(this._remote);

  final CoverLetterRemoteDataSource _remote;

  Future<CoverLetterResult> generate({
    required String jobTitle,
    required String companyName,
    required List<String> requirements,
    required String description,
    String? candidateName,
  }) => _remote.generate(
    jobTitle: jobTitle,
    companyName: companyName,
    requirements: requirements,
    description: description,
    candidateName: candidateName,
  );
}
