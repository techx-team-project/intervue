import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/job_alert/data/models/create_job_alert_request.dart';
import 'package:intervue_flutter/features/job_alert/data/models/job_alert_model.dart';
import 'package:intervue_flutter/features/job_alert/data/models/job_alert_summary_model.dart';
import 'package:intervue_flutter/features/job_alert/data/repositories/job_alert_repository_impl.dart';
import 'package:intervue_flutter/features/job_alert/presentation/controllers/job_alert_list_cubit.dart';
import 'package:intervue_flutter/features/job_alert/presentation/controllers/job_alert_list_state.dart';
import 'package:mocktail/mocktail.dart';

class MockJobAlertRepository extends Mock implements JobAlertRepositoryImpl {}

class FakeCreateJobAlertRequest extends Fake implements CreateJobAlertRequest {}

void main() {
  setUpAll(() {
    registerFallbackValue(FakeCreateJobAlertRequest());
  });

  late MockJobAlertRepository mockRepo;
  late JobAlertListCubit cubit;

  const sampleAlert1 = JobAlertModel(
    id: 1,
    userId: 10,
    title: 'Senior Flutter Developer',
    keyword: 'Flutter, Dart, BLoC',
    city: 'Hanoi',
    careerLevel: 'SENIOR',
    workMode: 'HYBRID',
    salaryMin: 25000000,
    currency: 'VND',
    frequency: 'DAILY',
    isActive: true,
    deliveredCount: 5,
  );

  const sampleAlert2 = JobAlertModel(
    id: 2,
    userId: 10,
    title: 'Backend Java Developer',
    keyword: 'Java, Spring Boot',
    city: 'Ho Chi Minh City',
    careerLevel: 'MIDDLE',
    workMode: 'ONSITE',
    salaryMin: 20000000,
    currency: 'VND',
    frequency: 'WEEKLY',
    isActive: false,
    deliveredCount: 2,
  );

  const sampleSummary = JobAlertSummaryModel(
    totalAlerts: 2,
    activeAlerts: 1,
    pausedAlerts: 1,
    totalDeliveries: 7,
  );

  setUp(() {
    mockRepo = MockJobAlertRepository();
    cubit = JobAlertListCubit(mockRepo);
  });

  tearDown(() {
    cubit.close();
  });

  group('JobAlertListCubit', () {
    test('initial state is JobAlertListInitial', () {
      expect(cubit.state, const JobAlertListInitial());
    });

    test(
      'loadAlerts emits [JobAlertListLoading, JobAlertListLoaded] on success',
      () async {
        when(() => mockRepo.getAlerts())
            .thenAnswer((_) async => [sampleAlert1, sampleAlert2]);
        when(() => mockRepo.getSummary())
            .thenAnswer((_) async => sampleSummary);

        final expected = expectLater(
          cubit.stream,
          emitsInOrder([
            const JobAlertListLoading(),
            const JobAlertListLoaded(
              alerts: [sampleAlert1, sampleAlert2],
              summary: sampleSummary,
            ),
          ]),
        );

        await cubit.loadAlerts();
        await expected;
      },
    );

    test(
      'loadAlerts emits [JobAlertListLoading, JobAlertListError] on failure',
      () async {
        when(() => mockRepo.getAlerts())
            .thenThrow(const ServerException('Lỗi tải thông báo'));
        when(() => mockRepo.getSummary())
            .thenAnswer((_) async => sampleSummary);

        final expected = expectLater(
          cubit.stream,
          emitsInOrder([
            const JobAlertListLoading(),
            const JobAlertListError('Lỗi tải thông báo'),
          ]),
        );

        await cubit.loadAlerts();
        await expected;
      },
    );

    test(
      'createAlert successfully adds new alert and updates summary',
      () async {
        when(() => mockRepo.getAlerts())
            .thenAnswer((_) async => [sampleAlert1]);
        when(() => mockRepo.getSummary()).thenAnswer(
          (_) async => const JobAlertSummaryModel(
            totalAlerts: 1,
            activeAlerts: 1,
            pausedAlerts: 0,
            totalDeliveries: 5,
          ),
        );

        await cubit.loadAlerts();

        const newAlert = JobAlertModel(
          id: 3,
          userId: 10,
          title: 'React Native Dev',
          frequency: 'DAILY',
          isActive: true,
        );
        when(() => mockRepo.createAlert(any()))
            .thenAnswer((_) async => newAlert);

        final success = await cubit.createAlert(
          const CreateJobAlertRequest(title: 'React Native Dev'),
        );

        expect(success, isTrue);
        expect(cubit.state, isA<JobAlertListLoaded>());
        final loaded = cubit.state as JobAlertListLoaded;
        expect(loaded.alerts.length, 2);
        expect(loaded.alerts.first.id, 3);
        expect(loaded.summary.totalAlerts, 2);
        expect(loaded.summary.activeAlerts, 2);
        expect(loaded.actionMessage, 'Job alert created successfully!');
      },
    );

    test('toggleAlert updates active status in list and summary', () async {
      when(() => mockRepo.getAlerts())
          .thenAnswer((_) async => [sampleAlert1, sampleAlert2]);
      when(() => mockRepo.getSummary()).thenAnswer((_) async => sampleSummary);

      await cubit.loadAlerts();

      final toggledAlert = sampleAlert1.copyWith(isActive: false);
      when(() => mockRepo.toggleAlert(1)).thenAnswer((_) async => toggledAlert);

      await cubit.toggleAlert(1);

      expect(cubit.state, isA<JobAlertListLoaded>());
      final loaded = cubit.state as JobAlertListLoaded;
      expect(loaded.alerts.first.isActive, isFalse);
      expect(loaded.summary.activeAlerts, 0);
      expect(loaded.summary.pausedAlerts, 2);
      expect(loaded.actionMessage, 'Alert paused: Senior Flutter Developer');
    });

    test('deleteAlert removes alert from list and updates summary', () async {
      when(() => mockRepo.getAlerts())
          .thenAnswer((_) async => [sampleAlert1, sampleAlert2]);
      when(() => mockRepo.getSummary()).thenAnswer((_) async => sampleSummary);

      await cubit.loadAlerts();

      when(() => mockRepo.deleteAlert(1)).thenAnswer((_) async {});

      await cubit.deleteAlert(1);

      expect(cubit.state, isA<JobAlertListLoaded>());
      final loaded = cubit.state as JobAlertListLoaded;
      expect(loaded.alerts.length, 1);
      expect(loaded.alerts.first.id, 2);
      expect(loaded.summary.totalAlerts, 1);
      expect(loaded.summary.activeAlerts, 0);
      expect(loaded.summary.pausedAlerts, 1);
      expect(loaded.actionMessage, 'Job alert deleted.');
    });

    test('sendTestEmail emits actionMessage on success', () async {
      when(() => mockRepo.getAlerts()).thenAnswer((_) async => [sampleAlert1]);
      when(() => mockRepo.getSummary()).thenAnswer((_) async => sampleSummary);

      await cubit.loadAlerts();

      when(() => mockRepo.sendTestEmail(1)).thenAnswer((_) async => true);

      await cubit.sendTestEmail(1);

      final loaded = cubit.state as JobAlertListLoaded;
      expect(
        loaded.actionMessage,
        'Test email with matching jobs sent! Please check your inbox.',
      );
    });

    test('clearAction clears actionMessage and actionError', () async {
      when(() => mockRepo.getAlerts()).thenAnswer((_) async => [sampleAlert1]);
      when(() => mockRepo.getSummary()).thenAnswer((_) async => sampleSummary);

      await cubit.loadAlerts();
      when(() => mockRepo.sendTestEmail(1)).thenAnswer((_) async => true);
      await cubit.sendTestEmail(1);

      expect((cubit.state as JobAlertListLoaded).actionMessage, isNotNull);

      cubit.clearAction();
      expect((cubit.state as JobAlertListLoaded).actionMessage, isNull);
    });
  });
}
