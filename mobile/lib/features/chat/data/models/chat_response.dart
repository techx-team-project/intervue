import 'package:equatable/equatable.dart';

class ChatResponse extends Equatable {
  const ChatResponse({required this.answer, this.sources = const []});

  final String answer;
  final List<String> sources;

  factory ChatResponse.fromJson(Map<String, dynamic> json) {
    return ChatResponse(
      answer: json['answer'] as String? ?? '',
      sources:
          (json['sources'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
    );
  }

  Map<String, dynamic> toJson() => {'answer': answer, 'sources': sources};

  @override
  List<Object?> get props => [answer, sources];
}
