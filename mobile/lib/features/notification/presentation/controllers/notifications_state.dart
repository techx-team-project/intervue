part of 'notifications_cubit.dart';

enum NotificationsStatus { initial, loading, loaded, failure }

class NotificationsState extends Equatable {
  const NotificationsState({
    this.status = NotificationsStatus.initial,
    this.items = const [],
    this.unreadCount = 0,
    this.errorMessage,
  });

  final NotificationsStatus status;
  final List<NotificationItem> items;
  final int unreadCount;
  final String? errorMessage;

  NotificationsState copyWith({
    NotificationsStatus? status,
    List<NotificationItem>? items,
    int? unreadCount,
  }) => NotificationsState(
    status: status ?? this.status,
    items: items ?? this.items,
    unreadCount: unreadCount ?? this.unreadCount,
    errorMessage: errorMessage,
  );

  @override
  List<Object?> get props => [status, items, unreadCount, errorMessage];
}
