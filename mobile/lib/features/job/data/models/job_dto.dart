import 'package:intervue_flutter/core/utils/formatters.dart';
import 'package:intervue_flutter/features/job/domain/entities/job_entity.dart';

class JobDTO {
  const JobDTO({
    required this.id,
    required this.title,
    required this.companyName,
    this.companyLogo,
    this.city,
    this.level,
    this.workingArrangement,
    this.salaryNegotiable = false,
    this.salaryMin,
    this.salaryMax,
    this.salaryCurrency,
    this.skills = const [],
    this.deadline,
    this.description,
    this.requirements,
    this.benefits,
  });

  factory JobDTO.fromJson(Map<String, dynamic> json) {
    final company = json['company'] as Map<String, dynamic>?;
    final location = json['location'] as Map<String, dynamic>?;
    final salary = json['salary'] as Map<String, dynamic>?;
    final skills = json['skills'] as List<dynamic>? ?? const [];
    return JobDTO(
      id: json['id'].toString(),
      title: json['title'] as String? ?? '',
      companyName: company?['name'] as String? ?? '',
      companyLogo: company?['logoUrl'] as String?,
      city: (location?['city'] ?? json['city']) as String?,
      level: json['level'] as String?,
      workingArrangement: json['workingArrangement'] as String?,
      salaryNegotiable: salary?['negotiable'] as bool? ?? false,
      salaryMin: (salary?['min'] as num?)?.toDouble(),
      salaryMax: (salary?['max'] as num?)?.toDouble(),
      salaryCurrency: salary?['currency'] as String?,
      skills: skills
          .map((e) => (e as Map<String, dynamic>)['name'] as String? ?? '')
          .where((name) => name.isNotEmpty)
          .toList(),
      deadline: DateTime.tryParse(json['deadline'] as String? ?? ''),
      description: json['description'] as String?,
      requirements: json['requirements'] as String?,
      benefits: json['benefits'] as String?,
    );
  }

  static const Duration _urgentWindow = Duration(days: 7);

  static const Map<String, String> _levelLabels = {
    'INTERN': 'Thực tập sinh',
    'JUNIOR': 'Junior',
    'MID': 'Middle',
    'SENIOR': 'Senior',
    'LEAD': 'Lead',
  };

  final String id;
  final String title;
  final String companyName;
  final String? companyLogo;
  final String? city;
  final String? level;
  final String? workingArrangement;
  final bool salaryNegotiable;
  final double? salaryMin;
  final double? salaryMax;
  final String? salaryCurrency;
  final List<String> skills;
  final DateTime? deadline;
  final String? description;
  final String? requirements;
  final String? benefits;

  JobEntity toEntity() {
    final levelLabel = _levelLabels[level];
    final closing = deadline;
    return JobEntity(
      id: id,
      title: title,
      companyName: companyName,
      displaySalary: _displaySalary(),
      location:
          city ?? (workingArrangement == 'REMOTE' ? 'Làm việc từ xa' : null),
      deadline: closing,
      companyLogo: companyLogo,
      experience: levelLabel,
      tags: skills,
      isUrgent:
          closing != null &&
          closing.difference(DateTime.now()) <= _urgentWindow,
      jobLevel: levelLabel,
      description: description,
      requirements: requirements,
      benefits: benefits,
      salaryMinMillions: _inMillions(salaryMin),
      salaryMaxMillions: _inMillions(salaryMax),
      isSalaryNegotiable:
          salaryNegotiable || (salaryMin == null && salaryMax == null),
      workingArrangement: workingArrangement,
    );
  }

  double? _inMillions(double? amount) =>
      salaryCurrency == 'VND' && amount != null ? amount / _million : null;

  String _displaySalary() {
    final min = salaryMin;
    final max = salaryMax;
    if (salaryNegotiable || (min == null && max == null)) return 'Thỏa thuận';
    if (salaryCurrency == 'USD') {
      if (min != null && max != null) {
        return '\$${min.round()} - \$${max.round()}';
      }
      if (max != null) return 'Tới \$${max.round()}';
      return 'Từ \$${min!.round()}';
    }
    return _millionsRange(
      min == null ? null : min / _million,
      max == null ? null : max / _million,
    );
  }

  static const double _million = 1000000;

  static String _millionsRange(double? min, double? max) {
    if (min != null && max != null) {
      return '${Formatters.millions(min)} - ${Formatters.millions(max)} triệu';
    }
    if (max != null) return 'Tới ${Formatters.millions(max)} triệu';
    return 'Từ ${Formatters.millions(min!)} triệu';
  }
}
