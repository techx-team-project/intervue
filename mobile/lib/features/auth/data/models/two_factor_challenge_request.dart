class TwoFactorChallengeRequest {
  const TwoFactorChallengeRequest({
    required this.tempToken,
    required this.code,
    this.trustDevice = false,
  });

  final String tempToken;
  final String code;
  final bool trustDevice;

  Map<String, dynamic> toJson() => {
    'tempToken': tempToken,
    'code': code,
    'trustDevice': trustDevice,
  };
}
