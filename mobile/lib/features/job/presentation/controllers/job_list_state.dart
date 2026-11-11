part of 'job_list_cubit.dart';

sealed class JobListState extends Equatable {
  const JobListState();

  @override
  List<Object?> get props => [];
}

final class JobListInitial extends JobListState {
  const JobListInitial();
}

final class JobListLoading extends JobListState {
  const JobListLoading();
}

final class JobListLoaded extends JobListState {
  const JobListLoaded(this.jobs);

  final List<JobEntity> jobs;

  @override
  List<Object?> get props => [jobs];
}

final class JobListError extends JobListState {
  const JobListError(this.message);

  final String message;

  @override
  List<Object?> get props => [message];
}
