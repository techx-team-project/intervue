import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/network/session_expired_notifier.dart';
import 'package:intervue_flutter/features/auth/data/models/auth_response.dart';
import 'package:intervue_flutter/features/auth/data/models/login_request.dart';
import 'package:intervue_flutter/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/login_cubit.dart';
import 'package:intervue_flutter/features/auth/presentation/views/login_screen.dart';
import 'package:mocktail/mocktail.dart';

class MockAuthRepository extends Mock implements AuthRepositoryImpl {}

void main() {
  late MockAuthRepository repository;
  late AuthBloc authBloc;

  setUpAll(
    () => registerFallbackValue(const LoginRequest(email: '', password: '')),
  );

  setUp(() {
    repository = MockAuthRepository();
    authBloc = AuthBloc(
      authRepository: repository,
      sessionExpiredNotifier: SessionExpiredNotifier(),
    );
  });

  tearDown(() => authBloc.close());

  Future<void> pumpScreen(WidgetTester tester) => tester.pumpWidget(
    MaterialApp(
      home: MultiBlocProvider(
        providers: [
          BlocProvider<AuthBloc>.value(value: authBloc),
          BlocProvider(create: (_) => LoginCubit(repository)),
        ],
        child: const LoginScreen(),
      ),
    ),
  );

  testWidgets('hiện lỗi validate khi để trống, không gọi API', (tester) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await pumpScreen(tester);

    await tester.tap(find.widgetWithText(ElevatedButton, 'Sign in'));
    await tester.pump();

    expect(find.text('Invalid email'), findsOneWidget);
    expect(find.textContaining('Password must be at least'), findsOneWidget);
    verifyNever(() => repository.login(any()));
  });

  testWidgets('đăng nhập thành công -> AuthBloc chuyển Authenticated', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1080, 2400);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    when(() => repository.login(any()))
        .thenAnswer((_) async => const AuthResponse(accessToken: 'a'));
    await pumpScreen(tester);

    await tester.enterText(find.byType(TextFormField).at(0), 'a@b.com');
    await tester.enterText(find.byType(TextFormField).at(1), '123456');
    await tester.tap(find.widgetWithText(ElevatedButton, 'Sign in'));
    await tester.pumpAndSettle();

    expect(authBloc.state, const AuthAuthenticated());
    verify(
      () => repository.login(
        const LoginRequest(email: 'a@b.com', password: '123456'),
      ),
    ).called(1);
  });
}
