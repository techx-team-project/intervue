import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
abstract class UserModel with _$UserModel {
  const factory UserModel({
    @JsonKey(fromJson: _idFromJson) required String id,
    required String email,
    @JsonKey(name: 'name') String? fullName,
    @Default(<String>[]) List<String> roles,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}

// Spring Boot thường trả id dạng số (Long); app dùng String thống nhất.
String _idFromJson(Object? value) => value.toString();
