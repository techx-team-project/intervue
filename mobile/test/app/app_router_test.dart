import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/app/routes/app_router.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';

void main() {
  String? redirect(AuthState state, String location) =>
      AppRouter.redirectFor(authState: state, location: location);

  group('auth guard', () {
    test('chưa biết trạng thái -> luôn về splash', () {
      expect(redirect(const AuthUnknown(), RouteNames.jobs), RouteNames.splash);
      expect(redirect(const AuthUnknown(), RouteNames.splash), isNull);
    });

    test('chưa đăng nhập: chặn route bảo vệ, cho route công khai', () {
      const state = AuthUnauthenticated();

      expect(redirect(state, RouteNames.resume), RouteNames.login);
      expect(redirect(state, RouteNames.applications), RouteNames.login);
      expect(redirect(state, RouteNames.jobAlerts), RouteNames.login);
      expect(redirect(state, RouteNames.jobs), isNull);
      expect(redirect(state, RouteNames.login), isNull);
      expect(redirect(state, RouteNames.splash), RouteNames.login);
    });

    test('đã đăng nhập: rời splash/login, vào được route bảo vệ', () {
      const state = AuthAuthenticated();

      expect(redirect(state, RouteNames.splash), RouteNames.jobs);
      expect(redirect(state, RouteNames.login), RouteNames.jobs);
      expect(redirect(state, RouteNames.resume), isNull);
      expect(redirect(state, RouteNames.jobs), isNull);
    });
  });
}
