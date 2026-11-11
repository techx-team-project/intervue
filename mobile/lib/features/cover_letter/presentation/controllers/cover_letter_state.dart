part of 'cover_letter_cubit.dart';

enum CoverLetterStatus { loading, success, failure }

enum CoverLetterLanguage {
  vietnamese(
    'Tiếng Việt',
    'Hãy viết thư xin việc hoàn toàn bằng tiếng Việt, giọng văn chuyên nghiệp, lịch sự.',
  ),
  english(
    'English',
    'Write the cover letter in English with a professional, polite tone.',
  );

  const CoverLetterLanguage(this.label, this.instruction);

  final String label;
  final String instruction;
}

class CoverLetterState extends Equatable {
  const CoverLetterState({
    this.status = CoverLetterStatus.loading,
    this.language = CoverLetterLanguage.vietnamese,
    this.letter,
    this.errorMessage,
  });

  final CoverLetterStatus status;
  final CoverLetterLanguage language;
  final CoverLetterResult? letter;
  final String? errorMessage;

  @override
  List<Object?> get props => [status, language, letter, errorMessage];
}
