import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/features/cover_letter/data/models/cover_letter_result.dart';

class CoverLetterRemoteDataSource {
  CoverLetterRemoteDataSource(this._client);

  final ApiClient _client;

  Future<CoverLetterResult> generate({
    required String jobTitle,
    required String companyName,
    required List<String> requirements,
    required String description,
    String? candidateName,
  }) async {
    final data = await _client.post(
      ApiEndpoints.coverLetter,
      receiveTimeout: const Duration(seconds: 90),
      data: {
        'jobTitle': jobTitle,
        'companyName': companyName,
        'jobRequirements': requirements,
        'jobDescription': description,
        if (candidateName != null && candidateName.isNotEmpty)
          'candidateName': candidateName,
      },
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Dữ liệu thư xin việc không hợp lệ');
    }
    return CoverLetterResult.fromJson(data);
  }
}
