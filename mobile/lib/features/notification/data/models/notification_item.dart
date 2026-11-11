import 'package:equatable/equatable.dart';

class NotificationItem extends Equatable {
  const NotificationItem({
    required this.id,
    required this.title,
    required this.summary,
    required this.createdAt,
    this.actionLabel,
    this.readAt,
  });

  factory NotificationItem.fromJson(Map<String, dynamic> json) =>
      NotificationItem(
        id: (json['id'] as num).toInt(),
        title: json['title'] as String? ?? '',
        summary: json['summary'] as String? ?? '',
        actionLabel: json['actionLabel'] as String?,
        createdAt:
            DateTime.tryParse(json['createdAt'] as String? ?? '')?.toLocal() ??
            DateTime.now(),
        readAt: DateTime.tryParse(json['readAt'] as String? ?? '')?.toLocal(),
      );

  final int id;
  final String title;
  final String summary;
  final String? actionLabel;
  final DateTime createdAt;
  final DateTime? readAt;

  bool get isUnread => readAt == null;

  NotificationItem markedRead() => NotificationItem(
    id: id,
    title: title,
    summary: summary,
    actionLabel: actionLabel,
    createdAt: createdAt,
    readAt: readAt ?? DateTime.now(),
  );

  @override
  List<Object?> get props => [
    id,
    title,
    summary,
    actionLabel,
    createdAt,
    readAt,
  ];
}
