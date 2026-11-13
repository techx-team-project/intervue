import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intervue_flutter/core/constants/app_constants.dart';
import 'package:intervue_flutter/core/errors/failures.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_filter_params.dart';
import 'package:intervue_flutter/features/job/domain/repositories/i_job_repository.dart';

part 'job_list_state.dart';

class JobListCubit extends Cubit<JobListState> {
  JobListCubit(this.jobRepository) : super(const JobListInitial());

  final IJobRepository jobRepository;

  /// [silent] keeps the current list while loading (used for pull-to-refresh).
  Future<void> loadJobs({
    JobFilterParams filter = const JobFilterParams(),
    bool silent = false,
  }) async {
    if (!silent) emit(const JobListLoading());
    try {
      final jobs = await jobRepository.fetchJobs(
        size: AppConstants.defaultPageSize,
        filter: filter,
      );
      emit(JobListLoaded(jobs));
    } catch (e) {
      emit(JobListError(Failure.fromException(e).message));
    }
  }
}
