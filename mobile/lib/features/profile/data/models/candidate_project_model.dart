import 'package:equatable/equatable.dart';

class CandidateProjectModel extends Equatable {
  const CandidateProjectModel({
    required this.id,
    required this.name,
    this.role,
    required this.startDate,
    this.endDate,
    this.current = false,
    this.description,
    this.highlights,
    this.githubUrl,
    this.demoUrl,
    this.technologies = const [],
  });

  factory CandidateProjectModel.fromJson(Map<String, dynamic> json) =>
      CandidateProjectModel(
        id: (json['id'] as num).toInt(),
        name: json['name'] as String? ?? '',
        role: json['role'] as String?,
        startDate: json['startDate'] != null
            ? DateTime.parse(json['startDate'] as String)
            : DateTime.now(),
        endDate: json['endDate'] != null
            ? DateTime.tryParse(json['endDate'] as String)
            : null,
        current: json['current'] as bool? ?? false,
        description: json['description'] as String?,
        highlights: json['highlights'] as String?,
        githubUrl: json['githubUrl'] as String?,
        demoUrl: json['demoUrl'] as String?,
        technologies:
            (json['technologies'] as List<dynamic>?)
                ?.map((e) => e.toString())
                .toList() ??
            const [],
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    if (role != null) 'role': role,
    'startDate':
        "${startDate.year.toString().padLeft(4, '0')}-${startDate.month.toString().padLeft(2, '0')}-${startDate.day.toString().padLeft(2, '0')}",
    if (endDate != null)
      'endDate':
          "${endDate!.year.toString().padLeft(4, '0')}-${endDate!.month.toString().padLeft(2, '0')}-${endDate!.day.toString().padLeft(2, '0')}",
    'current': current,
    if (description != null) 'description': description,
    if (highlights != null) 'highlights': highlights,
    if (githubUrl != null) 'githubUrl': githubUrl,
    if (demoUrl != null) 'demoUrl': demoUrl,
    'technologies': technologies,
  };

  final int id;
  final String name;
  final String? role;
  final DateTime startDate;
  final DateTime? endDate;
  final bool current;
  final String? description;
  final String? highlights;
  final String? githubUrl;
  final String? demoUrl;
  final List<String> technologies;

  @override
  List<Object?> get props => [
    id,
    name,
    role,
    startDate,
    endDate,
    current,
    description,
    highlights,
    githubUrl,
    demoUrl,
    technologies,
  ];
}
