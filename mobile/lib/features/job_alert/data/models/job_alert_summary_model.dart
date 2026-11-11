import 'package:equatable/equatable.dart';

class JobAlertSummaryModel extends Equatable {
  const JobAlertSummaryModel({
    this.totalAlerts = 0,
    this.activeAlerts = 0,
    this.pausedAlerts = 0,
    this.totalDeliveries = 0,
  });

  factory JobAlertSummaryModel.fromJson(Map<String, dynamic> json) =>
      JobAlertSummaryModel(
        totalAlerts: (json['totalAlerts'] as num?)?.toInt() ?? 0,
        activeAlerts: (json['activeAlerts'] as num?)?.toInt() ?? 0,
        pausedAlerts: (json['pausedAlerts'] as num?)?.toInt() ?? 0,
        totalDeliveries: (json['totalDeliveries'] as num?)?.toInt() ?? 0,
      );

  Map<String, dynamic> toJson() => {
    'totalAlerts': totalAlerts,
    'activeAlerts': activeAlerts,
    'pausedAlerts': pausedAlerts,
    'totalDeliveries': totalDeliveries,
  };

  final int totalAlerts;
  final int activeAlerts;
  final int pausedAlerts;
  final int totalDeliveries;

  @override
  List<Object?> get props => [
    totalAlerts,
    activeAlerts,
    pausedAlerts,
    totalDeliveries,
  ];
}
