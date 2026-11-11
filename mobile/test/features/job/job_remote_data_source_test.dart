import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/job/data/datasources/job_remote_data_source.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_filter_params.dart';

import '../../helpers/fakes.dart';

void main() {
  const job = {
    'id': 1,
    'title': 'Dev',
    'company': {'name': 'ACME'},
  };

  JobRemoteDataSource buildDataSource(FakeHttpAdapter adapter) =>
      JobRemoteDataSource(
        buildTestClient(adapter, storage: FakeSecureStorage()),
      );

  test('đọc được data dạng List', () async {
    final adapter = FakeHttpAdapter((_) => jsonResponse(envelope([job])));

    final jobs = await buildDataSource(adapter).getJobs(page: 0, size: 20);

    expect(jobs.single.title, 'Dev');
  });

  test('đọc được data dạng PageResource { items: [...] }', () async {
    final adapter = FakeHttpAdapter(
      (_) => jsonResponse(
        envelope({
          'items': [job],
          'totalPages': 1,
        }),
      ),
    );

    final jobs = await buildDataSource(adapter).getJobs(page: 0, size: 20);

    expect(jobs.single.companyName, 'ACME');
  });

  test('data sai cấu trúc -> ServerException', () async {
    final adapter = FakeHttpAdapter((_) => jsonResponse(envelope('oops')));

    await expectLater(
      buildDataSource(adapter).getJobs(page: 0, size: 20),
      throwsA(isA<ServerException>()),
    );
  });

  test('gửi page, size và bộ lọc dưới dạng query', () async {
    Uri? requested;
    final adapter = FakeHttpAdapter((o) {
      requested = o.uri;
      return jsonResponse(envelope(<Object>[]));
    });

    await buildDataSource(adapter).getJobs(
      page: 2,
      size: 10,
      filter: const JobFilterParams(keyword: 'flutter', minSalary: 15),
    );

    expect(requested?.queryParameters, {
      'page': '2',
      'size': '10',
      'q': 'flutter',
      'salaryFrom': '15000000',
      'currency': 'VND',
    });
  });

  test('gửi level và workingArrangement dưới dạng query khi có', () async {
    Uri? requested;
    final adapter = FakeHttpAdapter((o) {
      requested = o.uri;
      return jsonResponse(envelope(<Object>[]));
    });

    await buildDataSource(adapter).getJobs(
      page: 0,
      size: 20,
      filter: const JobFilterParams(
        level: 'SENIOR',
        workingArrangement: 'REMOTE',
      ),
    );

    expect(requested?.queryParameters, {
      'page': '0',
      'size': '20',
      'level': 'SENIOR',
      'workingArrangement': 'REMOTE',
    });
  });
}
