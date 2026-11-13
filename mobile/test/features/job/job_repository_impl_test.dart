import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/features/job/data/datasources/job_remote_data_source.dart';
import 'package:intervue_flutter/features/job/data/models/job_dto.dart';
import 'package:intervue_flutter/features/job/data/repositories/job_repository_impl.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_filter_params.dart';
import 'package:mocktail/mocktail.dart';

class MockJobRemoteDataSource extends Mock implements JobRemoteDataSource {}

void main() {
  late MockJobRemoteDataSource remote;
  late JobRepositoryImpl repository;

  setUpAll(() => registerFallbackValue(const JobFilterParams()));

  setUp(() {
    remote = MockJobRemoteDataSource();
    repository = JobRepositoryImpl(remote);
  });

  test('fetchJobs map DTO sang Entity', () async {
    when(
      () => remote.getJobs(
        page: any(named: 'page'),
        size: any(named: 'size'),
        filter: any(named: 'filter'),
      ),
    ).thenAnswer(
      (_) async => [
        const JobDTO(
          id: '1',
          title: 'Flutter Dev',
          companyName: 'ACME',
          salaryMax: 30000000,
          salaryCurrency: 'VND',
        ),
      ],
    );

    final jobs = await repository.fetchJobs(page: 1, size: 5);

    expect(jobs.single.title, 'Flutter Dev');
    expect(jobs.single.displaySalary, 'Up to 30M VND');
    verify(
      () => remote.getJobs(page: 1, size: 5, filter: const JobFilterParams()),
    ).called(1);
  });
}
