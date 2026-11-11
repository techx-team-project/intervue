import 'package:equatable/equatable.dart';

class CandidateLanguageModel extends Equatable {
  const CandidateLanguageModel({
    required this.id,
    required this.language,
    this.proficiency = 'INTERMEDIATE',
    this.certificate,
  });

  factory CandidateLanguageModel.fromJson(Map<String, dynamic> json) =>
      CandidateLanguageModel(
        id: (json['id'] as num).toInt(),
        language: json['language'] as String? ?? '',
        proficiency: json['proficiency'] as String? ?? 'INTERMEDIATE',
        certificate: json['certificate'] as String?,
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'language': language,
    'proficiency': proficiency,
    if (certificate != null) 'certificate': certificate,
  };

  final int id;
  final String language;
  final String proficiency;
  final String? certificate;

  String get proficiencyLabelVi {
    switch (proficiency) {
      case 'BASIC':
        return 'Sơ cấp';
      case 'INTERMEDIATE':
        return 'Trung cấp';
      case 'ADVANCED':
        return 'Nâng cao';
      case 'FLUENT':
        return 'Thành thạo';
      case 'NATIVE':
        return 'Bản ngữ';
      default:
        return proficiency;
    }
  }

  @override
  List<Object?> get props => [id, language, proficiency, certificate];
}
