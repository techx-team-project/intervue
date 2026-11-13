import 'package:equatable/equatable.dart';

class ChatSuggestion extends Equatable {
  const ChatSuggestion(this.text, {this.faqCode});

  final String text;
  final String? faqCode;

  @override
  List<Object?> get props => [text, faqCode];
}

abstract final class ChatSuggestions {
  static const List<ChatSuggestion> faq = [
    ChatSuggestion(
      'How do I verify a company?',
      faqCode: 'sq-company-verification',
    ),
    ChatSuggestion(
      'How do I create and optimize an ATS-ready CV?',
      faqCode: 'sq-ats-cv',
    ),
    ChatSuggestion(
      'How do applying and status tracking work?',
      faqCode: 'sq-apply-status',
    ),
    ChatSuggestion(
      'How do I turn on two-factor authentication (2FA)?',
      faqCode: 'sq-two-factor',
    ),
    ChatSuggestion(
      'How does InterVue support AI interview practice?',
      faqCode: 'sq-ai-interview',
    ),
  ];

  static const List<ChatSuggestion> assistant = [
    ChatSuggestion('Suggest Java Developer jobs for me'),
    ChatSuggestion('What is the status of my applications?'),
    ChatSuggestion('Which tech companies are hiring?'),
  ];

  static const List<ChatSuggestion> all = [...assistant, ...faq];
}
