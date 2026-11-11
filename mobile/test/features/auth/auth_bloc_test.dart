import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/network/session_expired_notifier.dart';
import 'package:intervue_flutter/features/auth/data/repositories/auth_repository_impl.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:mocktail/mocktail.dart';

class MockAuthRepository extends Mock implements AuthRepositoryImpl {}

void main() {
  late MockAuthRepository repository;
  late SessionExpiredNotifier notifier;
  late AuthBloc bloc;

  setUp(() {
    repository = MockAuthRepository();
    notifier = SessionExpiredNotifier();
    bloc = AuthBloc(
      authRepository: repository,
      sessionExpiredNotifier: notifier,
    );
  });

  tearDown(() async {
    await bloc.close();
    await notifier.dispose();
  });

  test('bắt đầu ở trạng thái Unknown', () {
    expect(bloc.state, const AuthUnknown());
  });

  test('AuthStarted có token -> Authenticated', () async {
    when(() => repository.hasSession()).thenAnswer((_) async => true);
    final states = expectLater(
      bloc.stream,
      emitsInOrder([const AuthAuthenticated()]),
    );

    bloc.add(const AuthStarted());

    await states;
  });

  test('AuthStarted không có token -> Unauthenticated', () async {
    when(() => repository.hasSession()).thenAnswer((_) async => false);
    final states = expectLater(
      bloc.stream,
      emitsInOrder([const AuthUnauthenticated()]),
    );

    bloc.add(const AuthStarted());

    await states;
  });

  test('AuthSignedOut gọi logout rồi -> Unauthenticated', () async {
    when(() => repository.logout()).thenAnswer((_) async {});
    final states = expectLater(
      bloc.stream,
      emitsInOrder([const AuthUnauthenticated()]),
    );

    bloc.add(const AuthSignedOut());

    await states;
    verify(() => repository.logout()).called(1);
  });

  test('phiên hết hạn từ interceptor -> Unauthenticated', () async {
    when(() => repository.clearSession()).thenAnswer((_) async {});
    final states = expectLater(
      bloc.stream,
      emitsInOrder([const AuthUnauthenticated(sessionExpired: true)]),
    );

    notifier.notify();

    await states;
    verify(() => repository.clearSession()).called(1);
  });
}
