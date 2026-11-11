import 'package:equatable/equatable.dart';

class ChatResponse extends Equatable {
  const ChatResponse({
    required this.answer,
    this.sources = const [],
    this.remainingQuota = 0,
  });

  final String answer;
  final List<String> sources;
  final int remainingQuota;

  factory ChatResponse.fromJson(Map<String, dynamic> json) {
    final rawQuota = json['remainingQuota'] ?? json['remaining_quota'] ?? 0;
    return ChatResponse(
      answer: json['answer'] as String? ?? '',
      sources:
          (json['sources'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      remainingQuota: (rawQuota is num) ? rawQuota.toInt() : 0,
    );
  }

  Map<String, dynamic> toJson() => {
    'answer': answer,
    'sources': sources,
    'remainingQuota': remainingQuota,
  };

  @override
  List<Object?> get props => [answer, sources, remainingQuota];
}
