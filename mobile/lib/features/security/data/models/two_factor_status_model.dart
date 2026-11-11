import 'package:equatable/equatable.dart';

class TwoFactorStatusModel extends Equatable {
  const TwoFactorStatusModel({
    required this.enabled,
    this.confirmedAt,
    this.remainingBackupCodes = 0,
  });

  factory TwoFactorStatusModel.fromJson(Map<String, dynamic> json) =>
      TwoFactorStatusModel(
        enabled: json['enabled'] as bool? ?? false,
        confirmedAt: json['confirmedAt'] != null
            ? DateTime.tryParse(json['confirmedAt'] as String)
            : null,
        remainingBackupCodes:
            (json['remainingBackupCodes'] as num?)?.toInt() ?? 0,
      );

  final bool enabled;
  final DateTime? confirmedAt;
  final int remainingBackupCodes;

  @override
  List<Object?> get props => [enabled, confirmedAt, remainingBackupCodes];
}
