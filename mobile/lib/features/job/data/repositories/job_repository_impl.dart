import 'package:intervue_flutter/features/job/data/datasources/job_remote_data_source.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_filter_params.dart';
import 'package:intervue_flutter/features/job/domain/repositories/i_job_repository.dart';

class JobRepositoryImpl implements IJobRepository {
  JobRepositoryImpl(this.remoteDataSource);

  final JobRemoteDataSource remoteDataSource;

  @override
  Future<List<JobEntity>> fetchJobs({
    int page = 0,
    int size = 20,
    JobFilterParams filter = const JobFilterParams(),
  }) async {
    final dtoList = await remoteDataSource.getJobs(
      page: page,
      size: size,
      filter: filter,
    );
    return dtoList.map((dto) => dto.toEntity()).toList();
  }

  @override
  Future<JobEntity> fetchJobDetail(String jobId) async {
    final dto = await remoteDataSource.getJobDetail(jobId);
    return dto.toEntity();
  }
}
