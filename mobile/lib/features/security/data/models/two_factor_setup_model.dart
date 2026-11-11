import 'package:equatable/equatable.dart';

class TwoFactorSetupModel extends Equatable {
  const TwoFactorSetupModel({
    required this.secret,
    required this.totpUri,
    this.qrCodeDataUrl,
    this.backupCodes = const [],
  });

  factory TwoFactorSetupModel.fromJson(Map<String, dynamic> json) =>
      TwoFactorSetupModel(
        secret: json['secret'] as String? ?? '',
        totpUri: json['totpUri'] as String? ?? '',
        qrCodeDataUrl: json['qrCodeDataUrl'] as String?,
        backupCodes:
            (json['backupCodes'] as List<dynamic>?)
                ?.map((e) => e.toString())
                .toList() ??
            const [],
      );

  final String secret;
  final String totpUri;
  final String? qrCodeDataUrl;
  final List<String> backupCodes;

  @override
  List<Object?> get props => [secret, totpUri, qrCodeDataUrl, backupCodes];
}
