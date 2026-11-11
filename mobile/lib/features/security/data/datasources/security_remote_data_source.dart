import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/features/security/data/models/account_session_model.dart';
import 'package:intervue_flutter/features/security/data/models/two_factor_setup_model.dart';
import 'package:intervue_flutter/features/security/data/models/two_factor_status_model.dart';

class SecurityRemoteDataSource {
  SecurityRemoteDataSource(this._client);

  final ApiClient _client;

  Future<TwoFactorStatusModel> get2FaStatus() async {
    final data = await _client.get(ApiEndpoints.userTwoFactor);
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Dữ liệu xác thực 2 bước không hợp lệ');
    }
    return TwoFactorStatusModel.fromJson(data);
  }

  Future<TwoFactorSetupModel> setup2Fa() async {
    final data = await _client.post(ApiEndpoints.userTwoFactorSetup);
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Không thể khởi tạo xác thực 2 bước');
    }
    return TwoFactorSetupModel.fromJson(data);
  }

  Future<TwoFactorStatusModel> confirm2Fa(String code) async {
    final data = await _client.post(
      ApiEndpoints.userTwoFactorConfirm,
      data: {'code': code},
    );
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Mã xác thực không đúng hoặc đã hết hạn');
    }
    return TwoFactorStatusModel.fromJson(data);
  }

  Future<void> disable2Fa({String? password}) async {
    await _client.post(
      ApiEndpoints.userTwoFactorDisable,
      queryParameters: password != null ? {'password': password} : null,
    );
  }

  Future<void> changePassword({
    required String currentPassword,
    required String password,
    required String confirmPassword,
  }) async {
    await _client.post(
      ApiEndpoints.userChangePassword,
      data: {
        'currentPassword': currentPassword,
        'password': password,
        'confirmPassword': confirmPassword,
      },
    );
  }

  Future<List<AccountSessionModel>> getSessions() async {
    final data = await _client.get(ApiEndpoints.userSessions);
    if (data is! List<dynamic>) {
      throw const ServerException('Dữ liệu phiên đăng nhập không hợp lệ');
    }
    return data
        .map((e) => AccountSessionModel.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> revokeSession(int id) async {
    await _client.delete(ApiEndpoints.userSession(id.toString()));
  }
}
