import 'package:intervue_flutter/features/security/data/datasources/security_remote_data_source.dart';
import 'package:intervue_flutter/features/security/data/models/account_session_model.dart';
import 'package:intervue_flutter/features/security/data/models/two_factor_setup_model.dart';
import 'package:intervue_flutter/features/security/data/models/two_factor_status_model.dart';

class SecurityRepositoryImpl {
  SecurityRepositoryImpl(this._remote);

  final SecurityRemoteDataSource _remote;

  Future<TwoFactorStatusModel> fetch2FaStatus() => _remote.get2FaStatus();

  Future<TwoFactorSetupModel> initiate2FaSetup() => _remote.setup2Fa();

  Future<TwoFactorStatusModel> confirm2Fa(String code) =>
      _remote.confirm2Fa(code);

  Future<void> disable2Fa({String? password}) =>
      _remote.disable2Fa(password: password);

  Future<void> changePassword({
    required String currentPassword,
    required String password,
    required String confirmPassword,
  }) => _remote.changePassword(
    currentPassword: currentPassword,
    password: password,
    confirmPassword: confirmPassword,
  );

  Future<List<AccountSessionModel>> fetchSessions() => _remote.getSessions();

  Future<void> revokeSession(int id) => _remote.revokeSession(id);
}
