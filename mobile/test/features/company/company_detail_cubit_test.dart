import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/company/data/models/public_company_model.dart';
import 'package:intervue_flutter/features/company/data/repositories/company_repository_impl.dart';
import 'package:intervue_flutter/features/company/presentation/controllers/company_detail_cubit.dart';
import 'package:intervue_flutter/features/company/presentation/controllers/company_detail_state.dart';
import 'package:mocktail/mocktail.dart';

class MockCompanyRepository extends Mock implements CompanyRepositoryImpl {}

void main() {
  late MockCompanyRepository mockRepo;
  late CompanyDetailCubit cubit;

  const sampleCompany = PublicCompanyModel(
    id: 1,
    name: 'TechX Corporation',
    industry: 'Software / IT Services',
    address: 'Hà Nội',
    website: 'https://techx.com',
    description: 'Tập đoàn công nghệ hàng đầu',
  );

  setUp(() {
    mockRepo = MockCompanyRepository();
    cubit = CompanyDetailCubit(mockRepo);
  });

  tearDown(() {
    cubit.close();
  });

  group('CompanyDetailCubit', () {
    test('initial state is CompanyDetailInitial', () {
      expect(cubit.state, const CompanyDetailInitial());
    });

    test('loadCompany emits [CompanyDetailLoading, CompanyDetailLoaded] on success', () async {
      when(() => mockRepo.getCompanyDetail(1))
          .thenAnswer((_) async => sampleCompany);

      final expected = expectLater(
        cubit.stream,
        emitsInOrder([
          const CompanyDetailLoading(),
          const CompanyDetailLoaded(sampleCompany),
        ]),
      );

      await cubit.loadCompany(1);
      await expected;
    });

    test(
      'loadCompany emits [CompanyDetailLoading, CompanyDetailError] on failure',
      () async {
        when(() => mockRepo.getCompanyDetail(999))
            .thenThrow(const ServerException('Không tìm thấy công ty'));

        final expected = expectLater(
          cubit.stream,
          emitsInOrder([
            const CompanyDetailLoading(),
            const CompanyDetailError('Không tìm thấy công ty'),
          ]),
        );

        await cubit.loadCompany(999);
        await expected;
      },
    );
  });
}
