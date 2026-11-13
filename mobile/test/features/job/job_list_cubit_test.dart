import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_filter_params.dart';
import 'package:intervue_flutter/features/job/domain/repositories/i_job_repository.dart';
import 'package:intervue_flutter/features/job/presentation/controllers/job_list_cubit.dart';
import 'package:mocktail/mocktail.dart';

class MockJobRepository extends Mock implements IJobRepository {}

void main() {
  const job = JobEntity(
    id: '1',
    title: 'Flutter Dev',
    companyName: 'ACME',
    displaySalary: '15 - 25M VND',
  );

  late MockJobRepository repository;
  late JobListCubit cubit;

  setUpAll(() => registerFallbackValue(const JobFilterParams()));

  setUp(() {
    repository = MockJobRepository();
    cubit = JobListCubit(repository);
  });

  tearDown(() => cubit.close());

  void stubFetch(Future<List<JobEntity>> Function() answer) => when(
    () => repository.fetchJobs(
      page: any(named: 'page'),
      size: any(named: 'size'),
      filter: any(named: 'filter'),
    ),
  ).thenAnswer((_) => answer());

  test('trạng thái đầu là Initial', () {
    expect(cubit.state, const JobListInitial());
  });

  test('loadJobs thành công: Loading -> Loaded', () async {
    stubFetch(() async => [job]);
    final states = expectLater(
      cubit.stream,
      emitsInOrder([
        const JobListLoading(),
        const JobListLoaded([job]),
      ]),
    );

    await cubit.loadJobs();

    await states;
  });

  test('loadJobs lỗi: Loading -> Error với message thân thiện', () async {
    stubFetch(() async => throw const NetworkException());
    final states = expectLater(
      cubit.stream,
      emitsInOrder([
        const JobListLoading(),
        const JobListError(
          'Unable to connect, please check your network and try again',
        ),
      ]),
    );

    await cubit.loadJobs();

    await states;
  });

  test('loadJobs(silent: true) không phát Loading', () async {
    stubFetch(() async => [job]);
    final states = expectLater(
      cubit.stream,
      emitsInOrder([
        const JobListLoaded([job]),
      ]),
    );

    await cubit.loadJobs(silent: true);

    await states;
  });
}
