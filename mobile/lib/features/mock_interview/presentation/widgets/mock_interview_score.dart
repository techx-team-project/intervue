import 'package:flutter/material.dart';

class MockInterviewScoreTone {
  const MockInterviewScoreTone({
    required this.foreground,
    required this.background,
    required this.border,
    required this.label,
  });

  factory MockInterviewScoreTone.of(int? score) {
    if (score == null) {
      return const MockInterviewScoreTone(
        foreground: Color(0xFF334155),
        background: Color(0xFFF8FAFC),
        border: Color(0xFFE2E8F0),
        label: 'Score unavailable',
      );
    }
    if (score >= 80) {
      return const MockInterviewScoreTone(
        foreground: Color(0xFF047857),
        background: Color(0xFFECFDF5),
        border: Color(0xFFA7F3D0),
        label: 'Excellent (Interview Ready)',
      );
    }
    if (score >= 65) {
      return const MockInterviewScoreTone(
        foreground: Color(0xFF1D4ED8),
        background: Color(0xFFEFF6FF),
        border: Color(0xFFBFDBFE),
        label: 'Proficient (Meets Core Requirements)',
      );
    }
    return const MockInterviewScoreTone(
      foreground: Color(0xFFB45309),
      background: Color(0xFFFFFBEB),
      border: Color(0xFFFDE68A),
      label: 'Needs Practice',
    );
  }

  final Color foreground;
  final Color background;
  final Color border;
  final String label;
}

class MockInterviewScoreChip extends StatelessWidget {
  const MockInterviewScoreChip({required this.score, super.key});

  final int score;

  @override
  Widget build(BuildContext context) {
    final tone = MockInterviewScoreTone.of(score);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: tone.background,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: tone.border),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.emoji_events_rounded, size: 14, color: tone.foreground),
          const SizedBox(width: 4),
          Text(
            '$score/100',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: tone.foreground,
            ),
          ),
        ],
      ),
    );
  }
}
