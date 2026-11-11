import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/features/job/data/models/job_dto.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_filter_params.dart';

class JobRemoteDataSource {
  JobRemoteDataSource(this._client);

  final ApiClient _client;

  static const int _vndPerMillion = 1000000;

  Future<List<JobDTO>> getJobs({
    required int page,
    required int size,
    JobFilterParams filter = const JobFilterParams(),
  }) async {
    final minSalary = filter.minSalary;
    final data = await _client.get(
      ApiEndpoints.jobs,
      skipAuth: true,
      queryParameters: {
        'page': page,
        'size': size,
        if (filter.keyword != null) 'q': filter.keyword,
        if (filter.location != null) 'city': filter.location,
        if (minSalary != null) ...{
          'salaryFrom': (minSalary * _vndPerMillion).round(),
          'currency': 'VND',
        },
        if (filter.level != null) 'level': filter.level,
        if (filter.workingArrangement != null)
          'workingArrangement': filter.workingArrangement,
      },
    );
    final items = switch (data) {
      List<dynamic>() => data,
      {'items': final List<dynamic> items} => items,
      {'content': final List<dynamic> content} => content,
      _ => throw const ServerException('Dữ liệu việc làm không hợp lệ'),
    };
    return items
        .map((e) => JobDTO.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<JobDTO> getJobDetail(String jobId) async {
    final data = await _client.get(
      ApiEndpoints.jobDetail(jobId),
      skipAuth: true,
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Dữ liệu việc làm không hợp lệ');
    }
    return JobDTO.fromJson(data);
  }
}
