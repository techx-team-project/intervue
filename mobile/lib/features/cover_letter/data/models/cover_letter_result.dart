import 'package:equatable/equatable.dart';

class CoverLetterResult extends Equatable {
  const CoverLetterResult({required this.text, required this.notice});

  factory CoverLetterResult.fromJson(Map<String, dynamic> json) =>
      CoverLetterResult(
        text: (json['coverLetter'] as String? ?? '').trim(),
        notice: json['notice'] as String? ?? '',
      );

  final String text;
  final String notice;

  @override
  List<Object?> get props => [text, notice];
}
