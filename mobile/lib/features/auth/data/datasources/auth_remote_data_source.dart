import 'package:dio/dio.dart';
import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/core/network/refresh_cookie.dart';
import 'package:intervue_flutter/features/auth/data/models/auth_response.dart';
import 'package:intervue_flutter/features/auth/data/models/login_request.dart';
import 'package:intervue_flutter/features/auth/data/models/register_request.dart';
import 'package:intervue_flutter/features/auth/data/models/two_factor_challenge_request.dart';

typedef AuthSession = ({AuthResponse auth, String? refreshToken});

class AuthRemoteDataSource {
  AuthRemoteDataSource(this._client);

  final ApiClient _client;

  Future<AuthSession> login(LoginRequest request) async {
    final result = await _client.postWithHeaders(
      ApiEndpoints.login,
      data: request.toJson(),
      skipAuth: true,
    );
    return _toSession(result.data, result.headers);
  }

  Future<AuthSession> verifyTwoFactor(TwoFactorChallengeRequest request) async {
    final result = await _client.postWithHeaders(
      ApiEndpoints.verifyTwoFactor,
      data: request.toJson(),
      skipAuth: true,
    );
    return _toSession(result.data, result.headers);
  }

  Future<void> verifySession() => _client.get(ApiEndpoints.currentUser);

  Future<void> register(RegisterRequest request) => _client.post(
    ApiEndpoints.register,
    data: request.toJson(),
    skipAuth: true,
  );

  Future<void> logout({String? refreshToken}) => _client.post(
    ApiEndpoints.logout,
    headers: refreshToken == null ? null : RefreshCookie.header(refreshToken),
  );

  AuthSession _toSession(dynamic data, Headers headers) {
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Invalid sign-in data');
    }
    return (
      auth: AuthResponse.fromJson(data),
      refreshToken: RefreshCookie.parse(headers),
    );
  }
}
