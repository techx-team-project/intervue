import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/storage/secure_storage.dart';
import 'package:intervue_flutter/features/auth/data/datasources/auth_remote_data_source.dart';
import 'package:intervue_flutter/features/auth/data/models/auth_response.dart';
import 'package:intervue_flutter/features/auth/data/models/login_request.dart';
import 'package:intervue_flutter/features/auth/data/models/register_request.dart';
import 'package:intervue_flutter/features/auth/data/models/two_factor_challenge_request.dart';

class AuthRepositoryImpl {
  AuthRepositoryImpl({
    required AuthRemoteDataSource remoteDataSource,
    required this._storage,
  }) : _remote = remoteDataSource;

  final AuthRemoteDataSource _remote;
  final SecureStorage _storage;

  Future<bool> hasSession() async {
    final token = await _storage.getAccessToken();
    if (token == null || token.isEmpty) return false;
    try {
      await _remote.verifySession();
      return true;
    } on UnauthorizedException {
      await _storage.clearTokens();
      return false;
    } on ForbiddenException {
      await _storage.clearTokens();
      return false;
    } on AppException {
      return true;
    }
  }

  Future<AuthResponse> login(LoginRequest request) async {
    final session = await _remote.login(request);
    await _persistSessionIfComplete(session);
    return session.auth;
  }

  Future<AuthResponse> verifyTwoFactor(
    TwoFactorChallengeRequest request,
  ) async {
    final session = await _remote.verifyTwoFactor(request);
    await _persistSessionIfComplete(session);
    return session.auth;
  }

  Future<void> _persistSessionIfComplete(AuthSession session) async {
    if (session.auth.requiresTwoFactor) return;
    final accessToken = session.auth.accessToken;
    if (accessToken == null || accessToken.isEmpty) {
      throw const ServerException('Phản hồi đăng nhập không chứa access token');
    }
    await _storage.saveTokens(
      accessToken: accessToken,
      refreshToken: session.refreshToken,
    );
  }

  Future<void> register(RegisterRequest request) => _remote.register(request);

  /// Luôn xoá token cục bộ, kể cả khi gọi API đăng xuất thất bại.
  Future<void> logout() async {
    try {
      await _remote.logout(refreshToken: await _storage.getRefreshToken());
    } on AppException {
      // Token sẽ bị xoá bên dưới; lỗi mạng không được chặn việc đăng xuất.
    } finally {
      await _storage.clearTokens();
    }
  }

  /// Dùng khi server báo phiên hết hạn (interceptor đã xoá token).
  Future<void> clearSession() => _storage.clearTokens();
}
