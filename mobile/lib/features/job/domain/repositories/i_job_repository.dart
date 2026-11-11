import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_filter_params.dart';

abstract class IJobRepository {
  Future<List<JobEntity>> fetchJobs({
    int page = 0,
    int size = 20,
    JobFilterParams filter = const JobFilterParams(),
  });

  Future<JobEntity> fetchJobDetail(String jobId);
}
