package com.techx.intervue.modules.notification.mappers;

import com.techx.intervue.modules.notification.entities.Notification;
import com.techx.intervue.modules.notification.entities.NotificationRecipient;
import com.techx.intervue.modules.notification.resources.AdminBroadcastResource;
import com.techx.intervue.modules.notification.resources.NotificationDetailResource;
import com.techx.intervue.modules.notification.resources.NotificationListResource;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {

    public NotificationListResource toListResource(NotificationRecipient recipient) {
        Notification notification = recipient.getNotification();
        return NotificationListResource.builder()
                .id(recipient.getId())
                .type(notification.getType())
                .category(notification.getCategory())
                .severity(notification.getSeverity())
                .title(notification.getTitle())
                .summary(notification.getSummary())
                .actionUrl(notification.getActionUrl())
                .actionLabel(notification.getActionLabel())
                .createdAt(recipient.getCreatedAt())
                .readAt(recipient.getReadAt())
                .seenAt(recipient.getSeenAt())
                .build();
    }

    public AdminBroadcastResource toBroadcastResource(
            Notification broadcast, long deliveredCount, long readCount) {
        return AdminBroadcastResource.builder()
                .id(broadcast.getId())
                .audience(broadcast.getAudience())
                .status(broadcast.getStatus())
                .severity(broadcast.getSeverity())
                .title(broadcast.getTitle())
                .summary(broadcast.getSummary())
                .bodyMarkdown(broadcast.getBodyMarkdown())
                .actionUrl(broadcast.getActionUrl())
                .actionLabel(broadcast.getActionLabel())
                .scheduledAt(broadcast.getScheduledAt())
                .sentAt(broadcast.getSentAt())
                .deliveredCount(deliveredCount)
                .readCount(readCount)
                .createdAt(broadcast.getCreatedAt())
                .updatedAt(broadcast.getUpdatedAt())
                .build();
    }

    public NotificationDetailResource toDetailResource(NotificationRecipient recipient) {
        Notification notification = recipient.getNotification();
        return NotificationDetailResource.builder()
                .id(recipient.getId())
                .type(notification.getType())
                .category(notification.getCategory())
                .severity(notification.getSeverity())
                .title(notification.getTitle())
                .summary(notification.getSummary())
                .bodyMarkdown(notification.getBodyMarkdown())
                .actionUrl(notification.getActionUrl())
                .actionLabel(notification.getActionLabel())
                .createdAt(recipient.getCreatedAt())
                .readAt(recipient.getReadAt())
                .seenAt(recipient.getSeenAt())
                .build();
    }
}
