import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intervue_flutter/core/constants/app_constants.dart';
import 'package:intervue_flutter/core/di/injection_container.dart';
import 'package:intervue_flutter/core/theme/app_theme.dart';
import 'package:intervue_flutter/core/widgets/app_messenger.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider<AuthBloc>.value(
      value: getIt<AuthBloc>(),
      child: BlocListener<AuthBloc, AuthState>(
        listenWhen: (previous, current) =>
            (previous is AuthUnauthenticated && current is AuthAuthenticated) ||
            (previous is AuthAuthenticated && current is AuthUnauthenticated),
        listener: (context, state) {
          switch (state) {
            case AuthAuthenticated():
              AppMessenger.success('Đăng nhập thành công');
            case AuthUnauthenticated(:final sessionExpired):
              if (sessionExpired) {
                AppMessenger.error(
                  'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại',
                );
              } else {
                AppMessenger.success('Đã đăng xuất');
              }
            case AuthUnknown():
              break;
          }
        },
        child: MaterialApp.router(
          title: AppConstants.appName,
          debugShowCheckedModeBanner: false,
          builder: (context, child) => Stack(
            children: [child ?? const SizedBox.shrink(), const AppBannerHost()],
          ),
          theme: AppTheme.light,
          routerConfig: getIt<GoRouter>(),
        ),
      ),
    );
  }
}
