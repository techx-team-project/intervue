import 'package:get_it/get_it.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/app/routes/app_router.dart';
import 'package:intervue_flutter/core/config/app_config.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/core/network/session_expired_notifier.dart';
import 'package:intervue_flutter/core/storage/secure_storage.dart';
import 'package:intervue_flutter/features/application/data/datasources/application_remote_data_source.dart';
import 'package:intervue_flutter/features/application/data/repositories/application_repository_impl.dart';
import 'package:intervue_flutter/features/application/presentation/controllers/application_list_cubit.dart';
import 'package:intervue_flutter/features/application/presentation/controllers/apply_job_cubit.dart';
import 'package:intervue_flutter/features/auth/data/datasources/auth_remote_data_source.dart';
import 'package:intervue_flutter/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/login_cubit.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/register_cubit.dart';
import 'package:intervue_flutter/features/blog/data/datasources/blog_remote_data_source.dart';
import 'package:intervue_flutter/features/blog/data/repositories/blog_repository_impl.dart';
import 'package:intervue_flutter/features/blog/presentation/controllers/blog_detail_cubit.dart';
import 'package:intervue_flutter/features/blog/presentation/controllers/blog_list_cubit.dart';
import 'package:intervue_flutter/features/blog/presentation/controllers/career_guide_cubit.dart';
import 'package:intervue_flutter/features/chat/data/datasources/chat_remote_data_source.dart';
import 'package:intervue_flutter/features/cover_letter/data/datasources/cover_letter_remote_data_source.dart';
import 'package:intervue_flutter/features/cover_letter/data/repositories/cover_letter_repository_impl.dart';
import 'package:intervue_flutter/features/cover_letter/presentation/controllers/cover_letter_cubit.dart';
import 'package:intervue_flutter/features/chat/data/repositories/chat_repository_impl.dart';
import 'package:intervue_flutter/features/chat/domain/repositories/i_chat_repository.dart';
import 'package:intervue_flutter/features/chat/presentation/controllers/chat_cubit.dart';
import 'package:intervue_flutter/features/company/data/datasources/company_remote_data_source.dart';
import 'package:intervue_flutter/features/company/data/repositories/company_repository_impl.dart';
import 'package:intervue_flutter/features/company/presentation/controllers/company_detail_cubit.dart';
import 'package:intervue_flutter/features/job/data/datasources/job_remote_data_source.dart';
import 'package:intervue_flutter/features/job/data/repositories/job_repository_impl.dart';
import 'package:intervue_flutter/features/job/domain/repositories/i_job_repository.dart';
import 'package:intervue_flutter/features/job/presentation/controllers/job_list_cubit.dart';
import 'package:intervue_flutter/features/job_alert/data/datasources/job_alert_remote_data_source.dart';
import 'package:intervue_flutter/features/job_alert/data/repositories/job_alert_repository_impl.dart';
import 'package:intervue_flutter/features/job_alert/presentation/controllers/job_alert_list_cubit.dart';
import 'package:intervue_flutter/features/notification/data/datasources/notification_remote_data_source.dart';
import 'package:intervue_flutter/features/notification/data/repositories/notification_repository_impl.dart';
import 'package:intervue_flutter/features/notification/presentation/controllers/notifications_cubit.dart';
import 'package:intervue_flutter/features/profile/data/datasources/profile_remote_data_source.dart';
import 'package:intervue_flutter/features/profile/data/repositories/profile_repository_impl.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/candidate_profile_cubit.dart';
import 'package:intervue_flutter/features/profile/presentation/controllers/profile_cubit.dart';
import 'package:intervue_flutter/features/resume/data/datasources/resume_remote_data_source.dart';
import 'package:intervue_flutter/features/resume/data/repositories/resume_repository_impl.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/candidate_cv_cubit.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/resume_review_cubit.dart';
import 'package:intervue_flutter/features/security/data/datasources/security_remote_data_source.dart';
import 'package:intervue_flutter/features/security/data/repositories/security_repository_impl.dart';
import 'package:intervue_flutter/features/security/presentation/controllers/security_cubit.dart';

final GetIt getIt = GetIt.instance;

void configureDependencies({AppConfig? config}) {
  getIt
    ..registerSingleton<AppConfig>(config ?? AppConfig.fromEnvironment())
    ..registerLazySingleton<SecureStorage>(SecureStorage.new)
    ..registerLazySingleton<SessionExpiredNotifier>(SessionExpiredNotifier.new)
    ..registerLazySingleton<ApiClient>(
      () => ApiClient.create(
        config: getIt(),
        storage: getIt(),
        sessionExpiredNotifier: getIt(),
      ),
    )
    ..registerLazySingleton<AuthRemoteDataSource>(
      () => AuthRemoteDataSource(getIt()),
    )
    ..registerLazySingleton<AuthRepositoryImpl>(
      () => AuthRepositoryImpl(remoteDataSource: getIt(), storage: getIt()),
    )
    ..registerLazySingleton<AuthBloc>(
      () => AuthBloc(authRepository: getIt(), sessionExpiredNotifier: getIt()),
    )
    ..registerFactory<LoginCubit>(() => LoginCubit(getIt()))
    ..registerFactory<RegisterCubit>(() => RegisterCubit(getIt()))
    ..registerLazySingleton<ChatRemoteDataSource>(
      () => ChatRemoteDataSource(getIt()),
    )
    ..registerLazySingleton<IChatRepository>(() => ChatRepositoryImpl(getIt()))
    ..registerFactory<ChatCubit>(() => ChatCubit(getIt()))
    ..registerLazySingleton<JobRemoteDataSource>(
      () => JobRemoteDataSource(getIt()),
    )
    ..registerLazySingleton<IJobRepository>(() => JobRepositoryImpl(getIt()))
    ..registerFactory<JobListCubit>(() => JobListCubit(getIt()))
    ..registerLazySingleton<BlogRemoteDataSource>(
      () => BlogRemoteDataSource(getIt()),
    )
    ..registerLazySingleton<BlogRepositoryImpl>(
      () => BlogRepositoryImpl(getIt()),
    )
    ..registerFactory<CareerGuideCubit>(() => CareerGuideCubit(getIt()))
    ..registerFactory<BlogListCubit>(() => BlogListCubit(getIt()))
    ..registerFactory<BlogDetailCubit>(() => BlogDetailCubit(getIt()))
    ..registerLazySingleton<ProfileRemoteDataSource>(
      () => ProfileRemoteDataSource(getIt()),
    )
    ..registerLazySingleton<ProfileRepositoryImpl>(
      () => ProfileRepositoryImpl(getIt()),
    )
    ..registerFactory<ProfileCubit>(() => ProfileCubit(getIt(), getIt()))
    ..registerFactory<CandidateProfileCubit>(
      () => CandidateProfileCubit(getIt(), getIt()),
    )
    ..registerLazySingleton<CompanyRemoteDataSource>(
      () => CompanyRemoteDataSource(getIt()),
    )
    ..registerLazySingleton<CompanyRepositoryImpl>(
      () => CompanyRepositoryImpl(getIt()),
    )
    ..registerFactory<CompanyDetailCubit>(() => CompanyDetailCubit(getIt()))
    ..registerLazySingleton<ResumeRemoteDataSource>(
      () => ResumeRemoteDataSource(getIt()),
    )
    ..registerLazySingleton<ResumeRepositoryImpl>(
      () => ResumeRepositoryImpl(getIt()),
    )
    ..registerFactory<ResumeReviewCubit>(() => ResumeReviewCubit(getIt()))
    ..registerFactory<CandidateCvCubit>(
      () => CandidateCvCubit(getIt(), getIt()),
    )
    ..registerLazySingleton<CoverLetterRemoteDataSource>(
      () => CoverLetterRemoteDataSource(getIt()),
    )
    ..registerLazySingleton<CoverLetterRepositoryImpl>(
      () => CoverLetterRepositoryImpl(getIt()),
    )
    ..registerFactory<CoverLetterCubit>(
      () => CoverLetterCubit(getIt(), getIt(), getIt()),
    )
    ..registerLazySingleton<NotificationRemoteDataSource>(
      () => NotificationRemoteDataSource(getIt()),
    )
    ..registerLazySingleton<NotificationRepositoryImpl>(
      () => NotificationRepositoryImpl(getIt()),
    )
    ..registerFactory<NotificationsCubit>(
      () => NotificationsCubit(getIt(), getIt()),
    )
    ..registerLazySingleton<ApplicationRemoteDataSource>(
      () => ApplicationRemoteDataSource(getIt()),
    )
    ..registerLazySingleton<ApplicationRepositoryImpl>(
      () => ApplicationRepositoryImpl(getIt()),
    )
    ..registerFactory<ApplicationListCubit>(() => ApplicationListCubit(getIt()))
    ..registerFactory<ApplyJobCubit>(
      () => ApplyJobCubit(
        applicationRepository: getIt(),
        resumeRepository: getIt(),
      ),
    )
    ..registerLazySingleton<JobAlertRemoteDataSource>(
      () => JobAlertRemoteDataSource(getIt()),
    )
    ..registerLazySingleton<JobAlertRepositoryImpl>(
      () => JobAlertRepositoryImpl(getIt()),
    )
    ..registerFactory<JobAlertListCubit>(() => JobAlertListCubit(getIt()))
    ..registerLazySingleton<SecurityRemoteDataSource>(
      () => SecurityRemoteDataSource(getIt()),
    )
    ..registerLazySingleton<SecurityRepositoryImpl>(
      () => SecurityRepositoryImpl(getIt()),
    )
    ..registerFactory<SecurityCubit>(() => SecurityCubit(getIt()))
    ..registerLazySingleton<GoRouter>(() => AppRouter.create(getIt()));
}
