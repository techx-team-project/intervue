import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/auth/data/models/auth_response.dart';
import 'package:intervue_flutter/features/auth/data/models/login_request.dart';
import 'package:intervue_flutter/features/auth/data/models/two_factor_challenge_request.dart';
import 'package:intervue_flutter/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/login_cubit.dart';
import 'package:mocktail/mocktail.dart';

class MockAuthRepository extends Mock implements AuthRepositoryImpl {}

void main() {
  const request = LoginRequest(email: 'a@b.com', password: '123456');

  late MockAuthRepository repository;
  late LoginCubit cubit;

  setUpAll(() {
    registerFallbackValue(request);
    registerFallbackValue(
      const TwoFactorChallengeRequest(tempToken: 't', code: '123456'),
    );
  });

  setUp(() {
    repository = MockAuthRepository();
    cubit = LoginCubit(repository);
  });

  tearDown(() => cubit.close());

  test('đăng nhập thành công: Loading -> Success', () async {
    when(() => repository.login(any()))
        .thenAnswer((_) async => const AuthResponse(accessToken: 'a'));
    final states = expectLater(
      cubit.stream,
      emitsInOrder([const LoginLoading(), const LoginSuccess()]),
    );

    await cubit.login(email: 'a@b.com', password: '123456');

    await states;
    verify(() => repository.login(request)).called(1);
  });

  test('đăng nhập sai: Loading -> Failure với message của server', () async {
    when(() => repository.login(any()))
        .thenThrow(const UnauthorizedException('Sai email hoặc mật khẩu'));
    final states = expectLater(
      cubit.stream,
      emitsInOrder([
        const LoginLoading(),
        const LoginFailure('Sai email hoặc mật khẩu'),
      ]),
    );

    await cubit.login(email: 'a@b.com', password: 'wrong');

    await states;
  });

  test(
    'yêu cầu 2FA: Loading -> LoginRequiresTwoFactor rồi verify -> Success',
    () async {
      when(() => repository.login(any())).thenAnswer(
        (_) async =>
            const AuthResponse(requiresTwoFactor: true, tempToken: 'tmp-123'),
      );
      when(() => repository.verifyTwoFactor(any()))
          .thenAnswer((_) async => const AuthResponse(accessToken: 'ok'));

      final states = expectLater(
        cubit.stream,
        emitsInOrder([
          const LoginLoading(),
          const LoginRequiresTwoFactor(tempToken: 'tmp-123'),
          const LoginRequiresTwoFactor(
            tempToken: 'tmp-123',
            isSubmitting: true,
          ),
          const LoginSuccess(),
        ]),
      );

      await cubit.login(email: 'a@b.com', password: '123456');
      await cubit.verifyTwoFactor(tempToken: 'tmp-123', code: '123456');

      await states;
    },
  );

  test(
    'yêu cầu 2FA: Loading -> LoginRequiresTwoFactor rồi verify -> Success',
    () async {
      when(() => repository.login(any())).thenAnswer(
        (_) async =>
            const AuthResponse(requiresTwoFactor: true, tempToken: 'tmp-123'),
      );
      when(() => repository.verifyTwoFactor(any()))
          .thenAnswer((_) async => const AuthResponse(accessToken: 'ok'));

      final states = expectLater(
        cubit.stream,
        emitsInOrder([
          const LoginLoading(),
          const LoginRequiresTwoFactor(tempToken: 'tmp-123'),
          const LoginRequiresTwoFactor(
            tempToken: 'tmp-123',
            isSubmitting: true,
          ),
          const LoginSuccess(),
        ]),
      );

      await cubit.login(email: 'a@b.com', password: '123456');
      await cubit.verifyTwoFactor(tempToken: 'tmp-123', code: '123456');

      await states;
    },
  );
}
