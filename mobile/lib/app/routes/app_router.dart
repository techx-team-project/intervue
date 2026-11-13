import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/go_router_refresh_stream.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/features/application/presentation/controllers/application_list_cubit.dart';
import 'package:intervue_flutter/features/application/presentation/views/application_screen.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/login_cubit.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/register_cubit.dart';
import 'package:intervue_flutter/features/auth/presentation/views/login_screen.dart';
import 'package:intervue_flutter/features/auth/presentation/widgets/leave_on_authenticated.dart';
import 'package:intervue_flutter/features/auth/presentation/views/register_screen.dart';
import 'package:intervue_flutter/features/auth/presentation/views/splash_screen.dart';
import 'package:intervue_flutter/features/blog/presentation/controllers/blog_detail_cubit.dart';
import 'package:intervue_flutter/features/blog/presentation/controllers/blog_list_cubit.dart';
import 'package:intervue_flutter/features/blog/presentation/controllers/career_guide_cubit.dart';
import 'package:intervue_flutter/features/blog/presentation/views/blog_detail_screen.dart';
import 'package:intervue_flutter/features/blog/presentation/views/blog_list_screen.dart';
import 'package:intervue_flutter/features/chat/data/models/chat_request.dart';
import 'package:intervue_flutter/features/chat/presentation/controllers/chat_cubit.dart';
import 'package:intervue_flutter/features/chat/presentation/views/ai_chat_screen.dart';
import 'package:intervue_flutter/features/job/presentation/controllers/job_list_cubit.dart';
import 'package:intervue_flutter/features/job/presentation/views/job_feed_screen.dart';
import 'package:intervue_flutter/features/job_alert/presentation/controllers/job_alert_list_cubit.dart';
import 'package:intervue_flutter/features/job_alert/presentation/views/job_alert_screen.dart';
import 'package:intervue_flutter/features/mock_interview/data/models/mock_interview_detail.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/controllers/mock_interview_history_cubit.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/controllers/mock_interview_room_cubit.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/controllers/mock_interview_setup_cubit.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/views/mock_interview_history_screen.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/views/mock_interview_room_screen.dart';
import 'package:intervue_flutter/features/mock_interview/presentation/views/mock_interview_setup_screen.dart';
import 'package:intervue_flutter/features/notification/presentation/controllers/notifications_cubit.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/candidate_profile_cubit.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/profile_cubit.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/candidate_cv_cubit.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/resume_review_cubit.dart';
import 'package:intervue_flutter/features/resume/presentation/views/resume_screen.dart';
import 'package:intervue_flutter/features/security/presentation/controllers/security_cubit.dart';
import 'package:intervue_flutter/features/security/presentation/views/account_security_screen.dart';
import 'package:intervue_flutter/features/upgrade/presentation/views/upgrade_screen.dart';

abstract final class AppRouter {
  static GoRouter create(AuthBloc authBloc) {
    final getIt = GetIt.instance;

    return GoRouter(
      initialLocation: RouteNames.splash,
      refreshListenable: GoRouterRefreshStream(authBloc.stream),
      redirect: (context, state) => redirectFor(
        authState: authBloc.state,
        location: state.matchedLocation,
      ),
      routes: [
        GoRoute(
          path: RouteNames.splash,
          builder: (_, _) => const SplashScreen(),
        ),
        GoRoute(
          path: RouteNames.login,
          builder: (_, _) => BlocProvider(
            create: (_) => getIt<LoginCubit>(),
            child: const LeaveOnAuthenticated(child: LoginScreen()),
          ),
        ),
        GoRoute(
          path: RouteNames.register,
          builder: (_, _) => BlocProvider(
            create: (_) => getIt<RegisterCubit>(),
            child: const RegisterScreen(),
          ),
        ),
        GoRoute(
          path: RouteNames.upgrade,
          builder: (_, _) => const UpgradeScreen(),
        ),
        GoRoute(
          path: RouteNames.aiChat,
          builder: (_, state) => BlocProvider(
            create: (_) {
              final cubit = getIt<ChatCubit>();
              if (state.extra is ChatContext) {
                cubit.setChatContext(state.extra as ChatContext);
              }
              return cubit;
            },
            child: AiChatScreen(
              initialContext: state.extra is ChatContext
                  ? state.extra as ChatContext
                  : null,
            ),
          ),
        ),
        GoRoute(
          path: RouteNames.jobs,
          builder: (_, _) => MultiBlocProvider(
            providers: [
              BlocProvider(create: (_) => getIt<JobListCubit>()..loadJobs()),
              BlocProvider(create: (_) => getIt<CareerGuideCubit>()..load()),
              BlocProvider(create: (_) => getIt<ProfileCubit>()),
              BlocProvider(create: (_) => getIt<CandidateProfileCubit>()),
              BlocProvider(create: (_) => getIt<NotificationsCubit>()),
              BlocProvider(create: (_) => getIt<CandidateCvCubit>()),
            ],
            child: const JobFeedScreen(),
          ),
        ),
        GoRoute(
          path: RouteNames.blog,
          builder: (_, _) => BlocProvider(
            create: (_) => getIt<BlogListCubit>()..load(),
            child: const BlogListScreen(),
          ),
        ),
        GoRoute(
          path: '${RouteNames.blog}/:category/:slug',
          builder: (_, state) {
            final category = state.pathParameters['category']!;
            final slug = state.pathParameters['slug']!;
            return BlocProvider(
              create: (_) => getIt<BlogDetailCubit>()..load(category, slug),
              child: BlogDetailScreen(categorySlug: category, slug: slug),
            );
          },
        ),
        GoRoute(
          path: RouteNames.resume,
          builder: (_, _) => BlocProvider(
            create: (_) => getIt<ResumeReviewCubit>()..loadInitial(),
            child: const ResumeScreen(),
          ),
        ),
        GoRoute(
          path: RouteNames.applications,
          builder: (_, _) => BlocProvider(
            create: (_) => getIt<ApplicationListCubit>(),
            child: const ApplicationScreen(),
          ),
        ),
        GoRoute(
          path: RouteNames.jobAlerts,
          builder: (_, _) => BlocProvider(
            create: (_) => getIt<JobAlertListCubit>(),
            child: const JobAlertScreen(),
          ),
        ),
        GoRoute(
          path: RouteNames.mockInterviews,
          builder: (_, _) => BlocProvider(
            create: (_) => getIt<MockInterviewHistoryCubit>(),
            child: const MockInterviewHistoryScreen(),
          ),
        ),
        GoRoute(
          path: RouteNames.mockInterviewNew,
          builder: (_, _) => BlocProvider(
            create: (_) => getIt<MockInterviewSetupCubit>(),
            child: const MockInterviewSetupScreen(),
          ),
        ),
        GoRoute(
          path: '${RouteNames.mockInterviews}/:id',
          builder: (_, state) {
            final id = int.tryParse(state.pathParameters['id'] ?? '');
            final extra = state.extra;
            return BlocProvider(
              create: (_) => getIt<MockInterviewRoomCubit>(
                param1: extra is MockInterviewDetail ? extra : null,
              ),
              child: MockInterviewRoomScreen(sessionId: id ?? 0),
            );
          },
        ),
        GoRoute(
          path: RouteNames.security,
          builder: (_, _) => BlocProvider(
            create: (_) => getIt<SecurityCubit>(),
            child: const AccountSecurityScreen(),
          ),
        ),
      ],
    );
  }

  @visibleForTesting
  static String? redirectFor({
    required AuthState authState,
    required String location,
  }) {
    if (authState is AuthUnknown) {
      return location == RouteNames.splash ? null : RouteNames.splash;
    }

    final isAuthenticated = authState is AuthAuthenticated;
    if (isAuthenticated) {
      final leavesAuthScreens =
          location == RouteNames.splash ||
          location == RouteNames.login ||
          location == RouteNames.register;
      return leavesAuthScreens ? RouteNames.jobs : null;
    }

    final needsLogin = RouteNames.protectedRoutes.any(location.startsWith);
    if (needsLogin || location == RouteNames.splash) return RouteNames.login;
    return null;
  }
}
