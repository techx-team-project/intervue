import 'package:equatable/equatable.dart';

class AccountSessionModel extends Equatable {
  const AccountSessionModel({
    required this.id,
    required this.deviceLabel,
    this.ipAddress,
    this.location,
    this.createdAt,
    this.lastUsedAt,
    this.current = false,
  });

  factory AccountSessionModel.fromJson(Map<String, dynamic> json) =>
      AccountSessionModel(
        id: (json['id'] as num).toInt(),
        deviceLabel:
            json['deviceLabel'] as String? ?? 'Thiết bị không xác định',
        ipAddress: json['ipAddress'] as String?,
        location: json['location'] as String?,
        createdAt: json['createdAt'] != null
            ? DateTime.tryParse(json['createdAt'] as String)
            : null,
        lastUsedAt: json['lastUsedAt'] != null
            ? DateTime.tryParse(json['lastUsedAt'] as String)
            : null,
        current: json['current'] as bool? ?? false,
      );

  final int id;
  final String deviceLabel;
  final String? ipAddress;
  final String? location;
  final DateTime? createdAt;
  final DateTime? lastUsedAt;
  final bool current;

  @override
  List<Object?> get props => [
    id,
    deviceLabel,
    ipAddress,
    location,
    createdAt,
    lastUsedAt,
    current,
  ];
}
