import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/blog/data/repositories/blog_repository_impl.dart';
import 'package:intervue_flutter/features/blog/presentation/controllers/career_guide_cubit.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_filter_params.dart';
import 'package:intervue_flutter/features/job/domain/repositories/i_job_repository.dart';
import 'package:intervue_flutter/features/job/presentation/controllers/job_list_cubit.dart';
import 'package:intervue_flutter/features/job/presentation/views/job_feed_screen.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_banner_carousel.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_header.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_job_card.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_market_insights.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_search_bar.dart';
import 'package:intervue_flutter/features/job/presentation/widgets/topcv_service_grid.dart';
import 'package:intervue_flutter/features/notification/data/models/notification_item.dart';
import 'package:intervue_flutter/features/notification/data/repositories/notification_repository_impl.dart';
import 'package:intervue_flutter/features/notification/presentation/controllers/notifications_cubit.dart';
import 'package:intervue_flutter/features/profile/data/models/candidate_profile_model.dart';
import 'package:intervue_flutter/features/profile/data/repositories/profile_repository_impl.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/candidate_profile_cubit.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/candidate_profile_state.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/profile_cubit.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/candidate_cv_cubit.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/candidate_cv_state.dart';
import 'package:mocktail/mocktail.dart';

class MockJobRepository extends Mock implements IJobRepository {}

class MockAuthBloc extends Mock implements AuthBloc {}

class MockBlogRepository extends Mock implements BlogRepositoryImpl {}

class MockProfileRepository extends Mock implements ProfileRepositoryImpl {}

class MockNotificationRepository extends Mock
    implements NotificationRepositoryImpl {}

class MockCandidateProfileCubit extends Mock implements CandidateProfileCubit {}

class MockCandidateCvCubit extends Mock implements CandidateCvCubit {}

void main() {
  late MockJobRepository jobRepository;
  late MockAuthBloc authBloc;
  late JobListCubit jobListCubit;
  late CareerGuideCubit careerGuideCubit;
  late ProfileCubit profileCubit;
  late NotificationsCubit notificationsCubit;
  late MockCandidateProfileCubit candidateProfileCubit;
  late MockCandidateCvCubit candidateCvCubit;

  const sampleJob = JobEntity(
    id: 'test-1',
    title: 'Senior Flutter Engineer',
    companyName: 'TopCV Tech',
    displaySalary: '25 - 40 triệu',
    location: 'Cầu Giấy, Hà Nội',
    experience: '3 năm',
    isHot: true,
    isUrgent: true,
    tags: ['Flutter', 'Dart', 'BLoC'],
  );

  setUpAll(() {
    registerFallbackValue(const JobFilterParams());
  });

  setUp(() {
    jobRepository = MockJobRepository();
    authBloc = MockAuthBloc();

    when(() => authBloc.state).thenReturn(const AuthAuthenticated());
    when(() => authBloc.stream).thenAnswer((_) => const Stream.empty());
    jobListCubit = JobListCubit(jobRepository);
    final blogRepository = MockBlogRepository();
    when(blogRepository.fetchFeaturedPosts).thenAnswer((_) async => []);
    careerGuideCubit = CareerGuideCubit(blogRepository);
    profileCubit = ProfileCubit(MockProfileRepository(), authBloc);
    final mockNotifRepo = MockNotificationRepository();
    when(mockNotifRepo.fetchNotifications).thenAnswer(
      (_) async => [
        NotificationItem(
          id: 1,
          title: 'VNPAY đã xem hồ sơ của bạn',
          summary: 'Nhà tuyển dụng đang quan tâm',
          createdAt: DateTime.now(),
        ),
      ],
    );
    when(mockNotifRepo.fetchUnreadCount).thenAnswer((_) async => 1);
    notificationsCubit = NotificationsCubit(mockNotifRepo, authBloc);

    candidateProfileCubit = MockCandidateProfileCubit();
    when(() => candidateProfileCubit.state).thenReturn(
      const CandidateProfileLoaded(
        profile: CandidateProfileModel(
          userId: 1,
          name: 'Nguyễn Văn A',
          jobSearchStatus: 'ACTIVELY_LOOKING',
        ),
      ),
    );
    when(() => candidateProfileCubit.stream)
        .thenAnswer((_) => const Stream.empty());
    when(() => candidateProfileCubit.loadProfile(silent: any(named: 'silent')))
        .thenAnswer((_) async {});

    candidateCvCubit = MockCandidateCvCubit();
    when(() => candidateCvCubit.state)
        .thenReturn(const CandidateCvLoaded(cvs: []));
    when(() => candidateCvCubit.stream).thenAnswer((_) => const Stream.empty());
    when(() => candidateCvCubit.loadCvs(silent: any(named: 'silent')))
        .thenAnswer((_) async {});
    when(() => candidateCvCubit.loadCvs()).thenAnswer((_) async {});

    when(
      () => jobRepository.fetchJobs(
        page: any(named: 'page'),
        size: any(named: 'size'),
        filter: any(named: 'filter'),
      ),
    ).thenAnswer((_) async => [sampleJob]);
  });

  tearDown(() {
    jobListCubit.close();
    careerGuideCubit.close();
    profileCubit.close();
    notificationsCubit.close();
  });

  Widget buildTestWidget() {
    return MaterialApp(
      home: MultiBlocProvider(
        providers: [
          BlocProvider<AuthBloc>.value(value: authBloc),
          BlocProvider<JobListCubit>.value(value: jobListCubit..loadJobs()),
          BlocProvider<CareerGuideCubit>.value(value: careerGuideCubit..load()),
          BlocProvider<ProfileCubit>.value(value: profileCubit),
          BlocProvider<NotificationsCubit>.value(value: notificationsCubit),
          BlocProvider<CandidateProfileCubit>.value(
            value: candidateProfileCubit,
          ),
          BlocProvider<CandidateCvCubit>.value(value: candidateCvCubit),
        ],
        child: const JobFeedScreen(),
      ),
    );
  }

  testWidgets('TopCV Mobile Home renders all flagship components', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(buildTestWidget());
    await tester.pumpAndSettle();

    // Verify Header
    expect(find.byType(TopCvHeader), findsOneWidget);
    expect(find.text('Toàn quốc'), findsOneWidget);

    // Verify Search Bar
    expect(find.byType(TopCvSearchBar), findsOneWidget);
    expect(find.text('Tìm việc làm, công ty, kỹ năng...'), findsOneWidget);

    // Verify Banner Carousel
    expect(find.byType(TopCvBannerCarousel), findsOneWidget);

    // Verify Services Grid
    expect(find.byType(TopCvServiceGrid), findsOneWidget);
    expect(find.text('Tạo CV'), findsWidgets);
    expect(find.text('Gross - Net'), findsOneWidget);

    // Verify Market Insights
    expect(find.byType(TopCvMarketInsights), findsOneWidget);
    expect(find.text('48.250+'), findsOneWidget);

    // Verify Job Cards
    expect(find.byType(TopCvJobCard), findsWidgets);
    expect(find.text('Senior Flutter Engineer'), findsOneWidget);

    // Verify Bottom Navigation Bar
    expect(find.text('Trang chủ'), findsOneWidget);
    expect(find.text('Tạo CV'), findsWidgets);
    expect(find.text('Thông báo'), findsOneWidget);
    expect(find.text('Cá nhân'), findsOneWidget);
  });

  testWidgets('Bottom navigation switches tabs cleanly', (tester) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(buildTestWidget());
    await tester.pumpAndSettle();

    // Tap "Thông báo" tab (index 3)
    await tester.tap(find.text('Thông báo').last);
    await tester.pumpAndSettle();

    expect(find.text('Đọc tất cả'), findsOneWidget);
    expect(find.text('VNPAY đã xem hồ sơ của bạn'), findsOneWidget);

    // Tap "Cá nhân" tab (index 4)
    await tester.tap(find.text('Cá nhân').last);
    await tester.pumpAndSettle();

    expect(find.text('Tài khoản cá nhân'), findsOneWidget);
    expect(find.text('Đang BẬT tìm việc'), findsOneWidget);
    expect(find.text('Hồ sơ năng lực cá nhân'), findsOneWidget);
  });
}
