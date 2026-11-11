import 'package:equatable/equatable.dart';

class JobAlertModel extends Equatable {
  const JobAlertModel({
    required this.id,
    required this.userId,
    required this.title,
    this.keyword,
    this.city,
    this.careerLevel,
    this.workMode,
    this.salaryMin,
    this.currency = 'VND',
    this.frequency = 'DAILY',
    this.isActive = true,
    this.lastSentAt,
    this.createdAt,
    this.deliveredCount = 0,
  });

  factory JobAlertModel.fromJson(Map<String, dynamic> json) => JobAlertModel(
    id: (json['id'] as num).toInt(),
    userId: (json['userId'] as num?)?.toInt() ?? 0,
    title: json['title'] as String? ?? '',
    keyword: json['keyword'] as String?,
    city: json['city'] as String?,
    careerLevel: json['careerLevel'] as String?,
    workMode: json['workMode'] as String?,
    salaryMin: (json['salaryMin'] as num?)?.toInt(),
    currency: json['currency'] as String? ?? 'VND',
    frequency: json['frequency'] as String? ?? 'DAILY',
    isActive: json['isActive'] as bool? ?? true,
    lastSentAt: json['lastSentAt'] != null
        ? DateTime.tryParse(json['lastSentAt'] as String)?.toLocal()
        : null,
    createdAt: json['createdAt'] != null
        ? DateTime.tryParse(json['createdAt'] as String)?.toLocal()
        : null,
    deliveredCount: (json['deliveredCount'] as num?)?.toInt() ?? 0,
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'userId': userId,
    'title': title,
    if (keyword != null) 'keyword': keyword,
    if (city != null) 'city': city,
    if (careerLevel != null) 'careerLevel': careerLevel,
    if (workMode != null) 'workMode': workMode,
    if (salaryMin != null) 'salaryMin': salaryMin,
    'currency': currency,
    'frequency': frequency,
    'isActive': isActive,
  };

  final int id;
  final int userId;
  final String title;
  final String? keyword;
  final String? city;
  final String? careerLevel;
  final String? workMode;
  final int? salaryMin;
  final String currency;
  final String frequency;
  final bool isActive;
  final DateTime? lastSentAt;
  final DateTime? createdAt;
  final int deliveredCount;

  String get frequencyLabelVi {
    switch (frequency) {
      case 'INSTANT':
        return 'Tức thì';
      case 'WEEKLY':
        return 'Hàng tuần';
      case 'DAILY':
      default:
        return 'Hàng ngày';
    }
  }

  String get workModeLabelVi {
    switch (workMode) {
      case 'REMOTE':
        return 'Làm từ xa (Remote)';
      case 'HYBRID':
        return 'Linh hoạt (Hybrid)';
      case 'ONSITE':
        return 'Tại văn phòng (Onsite)';
      default:
        return workMode ?? 'Tất cả hình thức';
    }
  }

  String get careerLevelLabelVi {
    switch (careerLevel) {
      case 'INTERN':
        return 'Thực tập sinh';
      case 'FRESHER':
        return 'Fresher';
      case 'JUNIOR':
        return 'Junior';
      case 'MIDDLE':
        return 'Middle';
      case 'SENIOR':
        return 'Senior';
      case 'LEAD':
        return 'Trưởng nhóm (Lead)';
      case 'MANAGER':
        return 'Quản lý (Manager)';
      default:
        return careerLevel ?? 'Tất cả cấp bậc';
    }
  }

  String get salaryLabelVi {
    if (salaryMin == null || salaryMin! <= 0) {
      return 'Thương lượng';
    }
    if (currency == 'VND') {
      final millions = salaryMin! / 1000000;
      final display = millions == millions.roundToDouble()
          ? millions.toInt().toString()
          : millions.toStringAsFixed(1);
      return 'Từ $display triệu VND';
    }
    return 'Từ $salaryMin $currency';
  }

  JobAlertModel copyWith({
    int? id,
    int? userId,
    String? title,
    String? keyword,
    String? city,
    String? careerLevel,
    String? workMode,
    int? salaryMin,
    String? currency,
    String? frequency,
    bool? isActive,
    DateTime? lastSentAt,
    DateTime? createdAt,
    int? deliveredCount,
  }) => JobAlertModel(
    id: id ?? this.id,
    userId: userId ?? this.userId,
    title: title ?? this.title,
    keyword: keyword ?? this.keyword,
    city: city ?? this.city,
    careerLevel: careerLevel ?? this.careerLevel,
    workMode: workMode ?? this.workMode,
    salaryMin: salaryMin ?? this.salaryMin,
    currency: currency ?? this.currency,
    frequency: frequency ?? this.frequency,
    isActive: isActive ?? this.isActive,
    lastSentAt: lastSentAt ?? this.lastSentAt,
    createdAt: createdAt ?? this.createdAt,
    deliveredCount: deliveredCount ?? this.deliveredCount,
  );

  @override
  List<Object?> get props => [
    id,
    userId,
    title,
    keyword,
    city,
    careerLevel,
    workMode,
    salaryMin,
    currency,
    frequency,
    isActive,
    lastSentAt,
    createdAt,
    deliveredCount,
  ];
}
