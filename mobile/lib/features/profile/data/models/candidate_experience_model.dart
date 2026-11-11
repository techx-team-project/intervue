import 'package:equatable/equatable.dart';

class CandidateExperienceModel extends Equatable {
  const CandidateExperienceModel({
    required this.id,
    required this.title,
    required this.companyName,
    this.location,
    required this.startDate,
    this.endDate,
    this.current = false,
    this.description,
    this.achievements,
    this.skills = const [],
  });

  factory CandidateExperienceModel.fromJson(Map<String, dynamic> json) =>
      CandidateExperienceModel(
        id: (json['id'] as num).toInt(),
        title: json['title'] as String? ?? '',
        companyName: json['companyName'] as String? ?? '',
        location: json['location'] as String?,
        startDate: json['startDate'] != null
            ? DateTime.parse(json['startDate'] as String)
            : DateTime.now(),
        endDate: json['endDate'] != null
            ? DateTime.tryParse(json['endDate'] as String)
            : null,
        current: json['current'] as bool? ?? false,
        description: json['description'] as String?,
        achievements: json['achievements'] as String?,
        skills:
            (json['skills'] as List<dynamic>?)
                ?.map((e) => e.toString())
                .toList() ??
            const [],
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'companyName': companyName,
    if (location != null) 'location': location,
    'startDate':
        "${startDate.year.toString().padLeft(4, '0')}-${startDate.month.toString().padLeft(2, '0')}-${startDate.day.toString().padLeft(2, '0')}",
    if (endDate != null)
      'endDate':
          "${endDate!.year.toString().padLeft(4, '0')}-${endDate!.month.toString().padLeft(2, '0')}-${endDate!.day.toString().padLeft(2, '0')}",
    'current': current,
    if (description != null) 'description': description,
    if (achievements != null) 'achievements': achievements,
    'skills': skills,
  };

  final int id;
  final String title;
  final String companyName;
  final String? location;
  final DateTime startDate;
  final DateTime? endDate;
  final bool current;
  final String? description;
  final String? achievements;
  final List<String> skills;

  @override
  List<Object?> get props => [
    id,
    title,
    companyName,
    location,
    startDate,
    endDate,
    current,
    description,
    achievements,
    skills,
  ];
}
