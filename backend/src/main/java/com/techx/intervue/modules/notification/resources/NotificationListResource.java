package com.techx.intervue.modules.notification.resources;

import com.techx.intervue.modules.notification.enums.NotificationCategory;
import com.techx.intervue.modules.notification.enums.NotificationSeverity;
import com.techx.intervue.modules.notification.enums.NotificationType;
import java.time.Instant;
import lombok.Builder;

@Builder
public record NotificationListResource(
        Long id,
        NotificationType type,
        NotificationCategory category,
        NotificationSeverity severity,
        String title,
        String summary,
        String actionUrl,
        String actionLabel,
        Instant createdAt,
        Instant readAt,
        Instant seenAt) {}
