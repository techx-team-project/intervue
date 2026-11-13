import 'package:intervue_flutter/core/constants/api_endpoints.dart';
import 'package:intervue_flutter/core/errors/exceptions.dart';
import 'package:intervue_flutter/core/network/api_client.dart';
import 'package:intervue_flutter/features/notification/data/models/notification_item.dart';

class NotificationRemoteDataSource {
  NotificationRemoteDataSource(this._client);

  final ApiClient _client;

  Future<List<NotificationItem>> getNotifications({
    int page = 0,
    int size = 30,
  }) async {
    final data = await _client.get(
      ApiEndpoints.notifications,
      queryParameters: {'page': page, 'size': size},
    );
    final items = data is Map<String, dynamic> ? data['items'] : null;
    if (items is! List<dynamic>) {
      throw const ServerException('Invalid notification data');
    }
    return items
        .map((e) => NotificationItem.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<int> getUnreadCount() async {
    final data = await _client.get(ApiEndpoints.notificationsUnreadCount);
    if (data is! Map<String, dynamic>) {
      throw const ServerException('Invalid notification data');
    }
    return (data['total'] as num?)?.toInt() ?? 0;
  }

  Future<void> markRead(int id) =>
      _client.post(ApiEndpoints.notificationRead(id));

  Future<void> markAllRead() => _client.post(ApiEndpoints.notificationsReadAll);
}
