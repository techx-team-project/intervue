import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

class ChatMarkdown extends StatefulWidget {
  const ChatMarkdown({super.key, required this.text, required this.onLinkTap});

  final String text;
  final ValueChanged<String> onLinkTap;

  @override
  State<ChatMarkdown> createState() => _ChatMarkdownState();
}

class _ChatMarkdownState extends State<ChatMarkdown> {
  static final RegExp _inline = RegExp(
    r'\*\*(.+?)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)|\*([^*\s][^*]*?)\*',
  );
  static final RegExp _heading = RegExp(r'^(#{1,6})\s+(.*)$');
  static final RegExp _bullet = RegExp(r'^\s*[-*•]\s+(.*)$');
  static final RegExp _numbered = RegExp(r'^\s*(\d+)[.)]\s+(.*)$');

  static const TextStyle _baseStyle = TextStyle(
    fontSize: 13.8,
    height: 1.5,
    color: Color(0xFF334155),
    fontFamily: 'Inter',
  );

  final List<TapGestureRecognizer> _recognizers = [];

  @override
  void dispose() {
    _disposeRecognizers();
    super.dispose();
  }

  void _disposeRecognizers() {
    for (final recognizer in _recognizers) {
      recognizer.dispose();
    }
    _recognizers.clear();
  }

  @override
  Widget build(BuildContext context) {
    _disposeRecognizers();
    final lines = widget.text.split('\n');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: lines.map(_buildLine).toList(),
    );
  }

  Widget _buildLine(String line) {
    if (line.trim().isEmpty) return const SizedBox(height: 6);

    final heading = _heading.firstMatch(line);
    if (heading != null) {
      return Padding(
        padding: const EdgeInsets.only(top: 4, bottom: 2),
        child: _richText(
          heading.group(2)!,
          baseStyle: _baseStyle.copyWith(
            fontSize: 15,
            fontWeight: FontWeight.bold,
            color: const Color(0xFF0F172A),
          ),
        ),
      );
    }

    final bullet = _bullet.firstMatch(line);
    if (bullet != null) {
      return _listItem('•', bullet.group(1)!);
    }

    final numbered = _numbered.firstMatch(line);
    if (numbered != null) {
      return _listItem('${numbered.group(1)}.', numbered.group(2)!);
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 2),
      child: _richText(line),
    );
  }

  Widget _listItem(String marker, String content) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 2, left: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 20, child: Text(marker, style: _baseStyle)),
          Expanded(child: _richText(content)),
        ],
      ),
    );
  }

  Widget _richText(String content, {TextStyle baseStyle = _baseStyle}) {
    return RichText(
      text: TextSpan(style: baseStyle, children: _parseInline(content)),
    );
  }

  List<InlineSpan> _parseInline(String content) {
    final spans = <InlineSpan>[];
    var cursor = 0;
    for (final match in _inline.allMatches(content)) {
      if (match.start > cursor) {
        spans.add(TextSpan(text: content.substring(cursor, match.start)));
      }
      spans.add(_spanFor(match));
      cursor = match.end;
    }
    if (cursor < content.length) {
      spans.add(TextSpan(text: content.substring(cursor)));
    }
    return spans;
  }

  InlineSpan _spanFor(RegExpMatch match) {
    final bold = match.group(1);
    if (bold != null) {
      return TextSpan(
        text: bold,
        style: const TextStyle(
          fontWeight: FontWeight.bold,
          color: Color(0xFF0F172A),
        ),
      );
    }
    final code = match.group(2);
    if (code != null) {
      return TextSpan(
        text: code,
        style: const TextStyle(
          fontFamily: 'monospace',
          backgroundColor: Color(0xFFF1F5F9),
          color: Color(0xFF0F172A),
        ),
      );
    }
    final linkLabel = match.group(3);
    if (linkLabel != null) {
      final url = match.group(4)!;
      final recognizer = TapGestureRecognizer()
        ..onTap = () => widget.onLinkTap(url);
      _recognizers.add(recognizer);
      return TextSpan(
        text: linkLabel,
        recognizer: recognizer,
        style: const TextStyle(
          color: AppColors.primary,
          fontWeight: FontWeight.w600,
          decoration: TextDecoration.underline,
        ),
      );
    }
    return TextSpan(
      text: match.group(5),
      style: const TextStyle(fontStyle: FontStyle.italic),
    );
  }
}
