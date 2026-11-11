import 'package:equatable/equatable.dart';

class CandidateEducationModel extends Equatable {
  const CandidateEducationModel({
    required this.id,
    required this.school,
    this.degree,
    this.major,
    required this.startYear,
    this.endYear,
    this.gpa,
    this.achievements,
  });

  factory CandidateEducationModel.fromJson(Map<String, dynamic> json) =>
      CandidateEducationModel(
        id: (json['id'] as num).toInt(),
        school: json['school'] as String? ?? '',
        degree: json['degree'] as String?,
        major: json['major'] as String?,
        startYear: (json['startYear'] as num?)?.toInt() ?? 2020,
        endYear: (json['endYear'] as num?)?.toInt(),
        gpa: json['gpa'] as String?,
        achievements: json['achievements'] as String?,
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'school': school,
    if (degree != null) 'degree': degree,
    if (major != null) 'major': major,
    'startYear': startYear,
    if (endYear != null) 'endYear': endYear,
    if (gpa != null) 'gpa': gpa,
    if (achievements != null) 'achievements': achievements,
  };

  final int id;
  final String school;
  final String? degree;
  final String? major;
  final int startYear;
  final int? endYear;
  final String? gpa;
  final String? achievements;

  @override
  List<Object?> get props => [
    id,
    school,
    degree,
    major,
    startYear,
    endYear,
    gpa,
    achievements,
  ];
}
