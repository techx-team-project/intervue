import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/application/data/models/application_model.dart';
import 'package:intervue_flutter/features/application/data/models/application_summary_model.dart';
import 'package:intervue_flutter/features/application/data/repositories/application_repository_impl.dart';
import 'package:intervue_flutter/features/application/presentation/controllers/application_list_cubit.dart';
import 'package:intervue_flutter/features/application/presentation/controllers/application_list_state.dart';
import 'package:mocktail/mocktail.dart';

class MockApplicationRepository extends Mock
    implements ApplicationRepositoryImpl {}

void main() {
  const sampleSummary = ApplicationSummaryModel(
    id: 10,
    status: 'APPLIED',
    jobId: 101,
    jobTitle: 'Flutter Senior Developer',
    companyName: 'TechX Corp',
  );

  const sampleModel = ApplicationModel(
    id: 10,
    status: 'WITHDRAWN',
    jobId: 101,
    jobTitle: 'Flutter Senior Developer',
  );

  late MockApplicationRepository repository;
  late ApplicationListCubit cubit;

  setUp(() {
    repository = MockApplicationRepository();
    cubit = ApplicationListCubit(repository);
  });

  tearDown(() => cubit.close());

  test('trạng thái ban đầu là ApplicationListInitial', () {
    expect(cubit.state, const ApplicationListInitial());
  });

  test('loadApplications thành công: Loading -> Loaded', () async {
    when(() => repository.getApplications())
        .thenAnswer((_) async => [sampleSummary]);

    final expected = expectLater(
      cubit.stream,
      emitsInOrder([
        const ApplicationListLoading(),
        const ApplicationListLoaded(applications: [sampleSummary]),
      ]),
    );

    await cubit.loadApplications();
    await expected;
  });

  test('loadApplications thất bại: Loading -> Error', () async {
    when(() => repository.getApplications())
        .thenThrow(const ServerException('Lỗi máy chủ'));

    final expected = expectLater(
      cubit.stream,
      emitsInOrder([
        const ApplicationListLoading(),
        const ApplicationListError('Lỗi máy chủ'),
      ]),
    );

    await cubit.loadApplications();
    await expected;
  });

  test('setFilter cập nhật filter trong Loaded state', () async {
    when(() => repository.getApplications())
        .thenAnswer((_) async => [sampleSummary]);

    await cubit.loadApplications();
    cubit.setFilter('IN_PROGRESS');

    expect(
      cubit.state,
      const ApplicationListLoaded(
        applications: [sampleSummary],
        selectedFilter: 'IN_PROGRESS',
      ),
    );
  });

  test('withdraw rút hồ sơ thành công và làm mới danh sách', () async {
    when(() => repository.getApplications())
        .thenAnswer((_) async => [sampleSummary]);
    when(() => repository.withdraw(10)).thenAnswer((_) async => sampleModel);

    await cubit.loadApplications();
    await cubit.withdraw(10);

    expect(
      cubit.state,
      const ApplicationListLoaded(
        applications: [sampleSummary],
        actionMessage: 'Đã rút hồ sơ ứng tuyển.',
      ),
    );
  });
}
