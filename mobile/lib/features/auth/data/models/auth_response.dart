import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:intervue_flutter/features/auth/data/models/user_model.dart';

part 'auth_response.freezed.dart';
part 'auth_response.g.dart';

@freezed
abstract class AuthResponse with _$AuthResponse {
  const factory AuthResponse({
    @JsonKey(name: 'accessToken') String? accessToken,
    UserModel? user,
    @Default(false) bool requiresTwoFactor,
    String? tempToken,
  }) = _AuthResponse;

  factory AuthResponse.fromJson(Map<String, dynamic> json) =>
      _$AuthResponseFromJson(json);
}
