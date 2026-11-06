package com.techx.intervue.modules.notification.resources;

import com.techx.intervue.modules.notification.enums.BroadcastAudience;
import com.techx.intervue.modules.notification.enums.BroadcastStatus;
import com.techx.intervue.modules.notification.enums.NotificationSeverity;
import java.time.Instant;
import lombok.Builder;

@Builder
public record AdminBroadcastResource(
        Long id,
        BroadcastAudience audience,
        BroadcastStatus status,
        NotificationSeverity severity,
        String title,
        String summary,
        String bodyMarkdown,
        String actionUrl,
        String actionLabel,
        Instant scheduledAt,
        Instant sentAt,
        long deliveredCount,
        long readCount,
        Instant createdAt,
        Instant updatedAt) {}
