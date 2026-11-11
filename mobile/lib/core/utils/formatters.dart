import 'package:intl/intl.dart';

abstract final class Formatters {
  static final NumberFormat _vnd = NumberFormat.decimalPattern('vi_VN');
  static final DateFormat _date = DateFormat('dd/MM/yyyy');

  /// 15000000 -> "15.000.000 ₫"
  static String currencyVnd(num value) => '${_vnd.format(value)} ₫';

  /// 2026-03-05 -> "05/03/2026"
  static String date(DateTime value) => _date.format(value);

  /// 52000 -> "52K", 1250 -> "1.3K", 480 -> "480"
  static String compactCount(int value) {
    if (value < 1000) return '$value';
    final thousands = value / 1000;
    final text = thousands.toStringAsFixed(1);
    return '${text.endsWith('.0') ? text.substring(0, text.length - 2) : text}K';
  }

  /// Khoảng thời gian tính từ [value] đến hiện tại, ví dụ "5 phút trước".
  static String timeAgo(DateTime value) {
    final diff = DateTime.now().difference(value);
    if (diff.inMinutes < 1) return 'Vừa xong';
    if (diff.inHours < 1) return '${diff.inMinutes} phút trước';
    if (diff.inDays < 1) return '${diff.inHours} giờ trước';
    if (diff.inDays < 7) return '${diff.inDays} ngày trước';
    return date(value);
  }

  /// Số triệu gọn: 15.0 -> "15", 12.5 -> "12.5"
  static String millions(double value) =>
      value == value.roundToDouble() ? value.toInt().toString() : '$value';
}
