import 'package:equatable/equatable.dart';

enum ScreeningQuestionType {
  choice,
  shortText;

  static ScreeningQuestionType fromString(String? value) {
    if (value?.toUpperCase() == 'CHOICE') return ScreeningQuestionType.choice;
    return ScreeningQuestionType.shortText;
  }

  String toBackendString() {
    switch (this) {
      case ScreeningQuestionType.choice:
        return 'CHOICE';
      case ScreeningQuestionType.shortText:
        return 'SHORT_TEXT';
    }
  }
}

class ScreeningQuestionModel extends Equatable {
  const ScreeningQuestionModel({
    required this.id,
    required this.type,
    required this.prompt,
    required this.required,
    this.options = const [],
  });

  factory ScreeningQuestionModel.fromJson(Map<String, dynamic> json) =>
      ScreeningQuestionModel(
        id: (json['id'] as num).toInt(),
        type: ScreeningQuestionType.fromString(json['type'] as String?),
        prompt: json['prompt'] as String? ?? '',
        required: json['required'] as bool? ?? false,
        options:
            (json['options'] as List<dynamic>?)
                ?.map((e) => e.toString())
                .toList() ??
            const [],
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'type': type.toBackendString(),
    'prompt': prompt,
    'required': required,
    'options': options,
  };

  final int id;
  final ScreeningQuestionType type;
  final String prompt;
  final bool required;
  final List<String> options;

  @override
  List<Object?> get props => [id, type, prompt, required, options];
}
