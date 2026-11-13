import 'package:equatable/equatable.dart';

class CandidateSkillModel extends Equatable {
  const CandidateSkillModel({
    required this.id,
    required this.name,
    this.category = 'TECHNICAL',
    this.level = 'INTERMEDIATE',
    this.years = 1,
  });

  factory CandidateSkillModel.fromJson(Map<String, dynamic> json) =>
      CandidateSkillModel(
        id: (json['id'] as num).toInt(),
        name: json['name'] as String? ?? '',
        category: json['category'] as String? ?? 'TECHNICAL',
        level: json['level'] as String? ?? 'INTERMEDIATE',
        years: (json['years'] as num?)?.toInt() ?? 1,
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'category': category,
    'level': level,
    'years': years,
  };

  final int id;
  final String name;
  final String category;
  final String level;
  final int years;

  String get levelLabelVi {
    switch (level) {
      case 'BEGINNER':
        return 'Basic';
      case 'INTERMEDIATE':
        return 'Intermediate';
      case 'ADVANCED':
        return 'Fluent';
      case 'EXPERT':
        return 'Expert';
      default:
        return level;
    }
  }

  @override
  List<Object?> get props => [id, name, category, level, years];
}
