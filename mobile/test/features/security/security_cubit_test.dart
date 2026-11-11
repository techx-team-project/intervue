import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/features/security/data/models/account_session_model.dart';
import 'package:intervue_flutter/features/security/data/models/two_factor_setup_model.dart';
import 'package:intervue_flutter/features/security/data/models/two_factor_status_model.dart';
import 'package:intervue_flutter/features/security/data/repositories/security_repository_impl.dart';
import 'package:intervue_flutter/features/security/presentation/controllers/security_cubit.dart';
import 'package:intervue_flutter/features/security/presentation/controllers/security_state.dart';
import 'package:mocktail/mocktail.dart';

class MockSecurityRepository extends Mock implements SecurityRepositoryImpl {}

void main() {
  late MockSecurityRepository mockRepo;
  late SecurityCubit cubit;

  const sampleStatusDisabled = TwoFactorStatusModel(enabled: false);
  const sampleStatusEnabled = TwoFactorStatusModel(
    enabled: true,
    remainingBackupCodes: 5,
  );
  const sampleSetup = TwoFactorSetupModel(
    secret: 'JBSWY3DPEHPK3PXP',
    totpUri: 'otpauth://totp/InterVue:user@test.com?secret=JBSWY3DPEHPK3PXP',
    backupCodes: ['CODE1', 'CODE2'],
  );
  final sampleSessions = [
    AccountSessionModel(
      id: 1,
      deviceLabel: 'Pixel 7 (Android 15)',
      ipAddress: '10.0.2.2',
      location: 'Hà Nội',
      current: true,
      createdAt: DateTime(2026, 1, 1),
    ),
    AccountSessionModel(
      id: 2,
      deviceLabel: 'Chrome Windows',
      ipAddress: '192.168.1.5',
      location: 'Hà Nội',
      current: false,
      createdAt: DateTime(2026, 1, 2),
    ),
  ];

  setUp(() {
    mockRepo = MockSecurityRepository();
    cubit = SecurityCubit(mockRepo);
  });

  tearDown(() {
    cubit.close();
  });

  group('SecurityCubit', () {
    test('initial state is SecurityInitial', () {
      expect(cubit.state, const SecurityInitial());
    });

    test(
      'loadSecurityData emits [SecurityLoading, SecurityLoaded] on success',
      () async {
        when(() => mockRepo.fetch2FaStatus())
            .thenAnswer((_) async => sampleStatusDisabled);
        when(() => mockRepo.fetchSessions())
            .thenAnswer((_) async => sampleSessions);

        final expected = expectLater(
          cubit.stream,
          emitsInOrder([
            const SecurityLoading(),
            SecurityLoaded(
              status: sampleStatusDisabled,
              sessions: sampleSessions,
            ),
          ]),
        );

        await cubit.loadSecurityData();
        await expected;
      },
    );

    test(
      'loadSecurityData emits [SecurityLoading, SecurityError] on failure',
      () async {
        when(() => mockRepo.fetch2FaStatus())
            .thenThrow(const ServerException('Lỗi tải dữ liệu bảo mật'));

        final expected = expectLater(
          cubit.stream,
          emitsInOrder([
            const SecurityLoading(),
            const SecurityError('Lỗi tải dữ liệu bảo mật'),
          ]),
        );

        await cubit.loadSecurityData();
        await expected;
      },
    );

    test('initiate2FaSetup sets setupData successfully', () async {
      when(() => mockRepo.fetch2FaStatus())
          .thenAnswer((_) async => sampleStatusDisabled);
      when(() => mockRepo.fetchSessions())
          .thenAnswer((_) async => sampleSessions);
      when(() => mockRepo.initiate2FaSetup())
          .thenAnswer((_) async => sampleSetup);

      await cubit.loadSecurityData();
      await cubit.initiate2FaSetup();

      expect(cubit.state, isA<SecurityLoaded>());
      final loaded = cubit.state as SecurityLoaded;
      expect(loaded.setupData, sampleSetup);
      expect(loaded.isSubmittingAction, false);
    });

    test('confirm2Fa activates 2FA and sets actionMessage', () async {
      when(() => mockRepo.fetch2FaStatus())
          .thenAnswer((_) async => sampleStatusDisabled);
      when(() => mockRepo.fetchSessions())
          .thenAnswer((_) async => sampleSessions);
      when(() => mockRepo.confirm2Fa('123456'))
          .thenAnswer((_) async => sampleStatusEnabled);

      await cubit.loadSecurityData();
      await cubit.confirm2Fa('123456');

      expect(cubit.state, isA<SecurityLoaded>());
      final loaded = cubit.state as SecurityLoaded;
      expect(loaded.status.enabled, true);
      expect(
        loaded.actionMessage,
        'Kích hoạt xác thực 2 bước (2FA) thành công!',
      );
    });

    test('disable2Fa turns off 2FA successfully', () async {
      when(() => mockRepo.fetch2FaStatus())
          .thenAnswer((_) async => sampleStatusEnabled);
      when(() => mockRepo.fetchSessions())
          .thenAnswer((_) async => sampleSessions);
      when(() => mockRepo.disable2Fa(password: any(named: 'password')))
          .thenAnswer((_) async {});

      await cubit.loadSecurityData();

      // Return disabled status on re-fetch
      when(() => mockRepo.fetch2FaStatus())
          .thenAnswer((_) async => sampleStatusDisabled);

      await cubit.disable2Fa();

      expect(cubit.state, isA<SecurityLoaded>());
      final loaded = cubit.state as SecurityLoaded;
      expect(loaded.status.enabled, false);
      expect(loaded.actionMessage, 'Đã tắt xác thực 2 bước.');
    });

    test('changePassword executes and emits actionMessage', () async {
      when(() => mockRepo.fetch2FaStatus())
          .thenAnswer((_) async => sampleStatusDisabled);
      when(() => mockRepo.fetchSessions())
          .thenAnswer((_) async => sampleSessions);
      when(
        () => mockRepo.changePassword(
          currentPassword: any(named: 'currentPassword'),
          password: any(named: 'password'),
          confirmPassword: any(named: 'confirmPassword'),
        ),
      ).thenAnswer((_) async {});

      await cubit.loadSecurityData();
      await cubit.changePassword(
        currentPassword: 'OldPassword123!',
        password: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      );

      final loaded = cubit.state as SecurityLoaded;
      expect(loaded.actionMessage, 'Đổi mật khẩu tài khoản thành công!');
    });

    test('revokeSession terminates session and reloads', () async {
      when(() => mockRepo.fetch2FaStatus())
          .thenAnswer((_) async => sampleStatusDisabled);
      when(() => mockRepo.fetchSessions())
          .thenAnswer((_) async => sampleSessions);
      when(() => mockRepo.revokeSession(2)).thenAnswer((_) async {});

      await cubit.loadSecurityData();

      final remaining = [sampleSessions.first];
      when(() => mockRepo.fetchSessions()).thenAnswer((_) async => remaining);

      await cubit.revokeSession(2);

      final loaded = cubit.state as SecurityLoaded;
      expect(loaded.sessions.length, 1);
      expect(loaded.actionMessage, 'Đã ngắt phiên đăng nhập thiết bị.');
    });
  });
}
