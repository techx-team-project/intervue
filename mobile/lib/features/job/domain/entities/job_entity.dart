import 'package:equatable/equatable.dart';

/// Pure Dart: không phụ thuộc Flutter, Dio hay JSON.
class JobEntity extends Equatable {
  const JobEntity({
    required this.id,
    required this.title,
    required this.companyName,
    required this.displaySalary,
    this.location,
    this.deadline,
    this.companyLogo,
    this.experience,
    this.tags = const [],
    this.isHot = false,
    this.isUrgent = false,
    this.companyScale,
    this.jobLevel,
    this.description,
    this.requirements,
    this.benefits,
    this.salaryMinMillions,
    this.salaryMaxMillions,
    this.isSalaryNegotiable = false,
    this.workingArrangement,
  });

  final String id;
  final double? salaryMinMillions;
  final double? salaryMaxMillions;
  final bool isSalaryNegotiable;
  final String? workingArrangement;
  final String title;
  final String companyName;
  final String displaySalary;
  final String? location;
  final DateTime? deadline;
  final String? companyLogo;
  final String? experience;
  final List<String> tags;
  final bool isHot;
  final bool isUrgent;
  final String? companyScale;
  final String? jobLevel;
  final String? description;
  final String? requirements;
  final String? benefits;

  bool get isExpired => deadline != null && deadline!.isBefore(DateTime.now());

  @override
  List<Object?> get props => [
    id,
    title,
    companyName,
    displaySalary,
    location,
    deadline,
    companyLogo,
    experience,
    tags,
    isHot,
    isUrgent,
    companyScale,
    jobLevel,
    description,
    requirements,
    benefits,
    salaryMinMillions,
    salaryMaxMillions,
    isSalaryNegotiable,
    workingArrangement,
  ];
}
