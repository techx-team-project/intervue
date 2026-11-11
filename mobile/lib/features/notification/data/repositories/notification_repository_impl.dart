import 'package:intervue_flutter/features/notification/data/datasources/notification_remote_data_source.dart';
import 'package:intervue_flutter/features/notification/data/models/notification_item.dart';

class NotificationRepositoryImpl {
  NotificationRepositoryImpl(this._remote);

  final NotificationRemoteDataSource _remote;

  Future<List<NotificationItem>> fetchNotifications() =>
      _remote.getNotifications();

  Future<int> fetchUnreadCount() => _remote.getUnreadCount();

  Future<void> markRead(int id) => _remote.markRead(id);

  Future<void> markAllRead() => _remote.markAllRead();
}
