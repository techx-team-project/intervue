import 'package:flutter/material.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';

/// Renders the Markdown subset used by blog posts: headings, paragraphs, lists,
/// quotes and bold/italic text.
class SimpleMarkdown extends StatelessWidget {
  const SimpleMarkdown({required this.data, super.key});

  final String data;

  static final RegExp _bullet = RegExp(r'^[-*+]\s+(.*)$');
  static final RegExp _numbered = RegExp(r'^(\d+)[.)]\s+(.*)$');
  static final RegExp _inline = RegExp(r'\*\*(.+?)\*\*|\*(.+?)\*');

  static const TextStyle _body = TextStyle(
    fontSize: 15,
    height: 1.6,
    color: AppColors.textPrimary,
  );

  @override
  Widget build(BuildContext context) {
    final blocks = <Widget>[];
    for (final raw in data.split('\n')) {
      final line = raw.trim();
      if (line.isEmpty) continue;
      blocks.add(_block(line));
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: blocks,
    );
  }

  Widget _block(String line) {
    if (line.startsWith('###')) {
      return _heading(line.substring(3).trim(), 17, 16);
    }
    if (line.startsWith('##')) {
      return _heading(line.substring(2).trim(), 20, 22);
    }
    if (line.startsWith('#')) {
      return _heading(line.substring(1).trim(), 22, 22);
    }
    if (line.startsWith('>')) return _quote(line.substring(1).trim());

    final numbered = _numbered.firstMatch(line);
    if (numbered != null) {
      return _listItem('${numbered.group(1)}.', numbered.group(2)!);
    }
    final bullet = _bullet.firstMatch(line);
    if (bullet != null) return _listItem('•', bullet.group(1)!);

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text.rich(TextSpan(children: _spans(line, _body)), style: _body),
    );
  }

  Widget _heading(String text, double size, double topGap) {
    return Padding(
      padding: EdgeInsets.only(top: topGap, bottom: 8),
      child: Text(
        text.replaceAll('**', ''),
        style: TextStyle(
          fontSize: size,
          fontWeight: FontWeight.w800,
          height: 1.3,
          color: AppColors.textPrimary,
        ),
      ),
    );
  }

  Widget _quote(String text) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: const BoxDecoration(
        color: AppColors.primaryLight,
        border: Border(left: BorderSide(color: AppColors.primary, width: 4)),
      ),
      child: Text.rich(
        TextSpan(children: _spans(text, _body)),
        style: _body.copyWith(fontSize: 14.5),
      ),
    );
  }

  Widget _listItem(String marker, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, left: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 24,
            child: Text(
              marker,
              style: _body.copyWith(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: Text.rich(
              TextSpan(children: _spans(text, _body)),
              style: _body,
            ),
          ),
        ],
      ),
    );
  }

  List<InlineSpan> _spans(String text, TextStyle base) {
    final spans = <InlineSpan>[];
    var cursor = 0;
    for (final match in _inline.allMatches(text)) {
      if (match.start > cursor) {
        spans.add(TextSpan(text: text.substring(cursor, match.start)));
      }
      final bold = match.group(1);
      spans.add(
        TextSpan(
          text: bold ?? match.group(2),
          style: bold != null
              ? const TextStyle(fontWeight: FontWeight.w800)
              : const TextStyle(fontStyle: FontStyle.italic),
        ),
      );
      cursor = match.end;
    }
    if (cursor < text.length) spans.add(TextSpan(text: text.substring(cursor)));
    return spans;
  }
}
