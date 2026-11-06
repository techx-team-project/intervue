package com.techx.intervue.modules.notification.requests;

import com.techx.intervue.modules.notification.enums.NotificationCategory;
import java.time.Instant;

public record SearchNotificationRequest(
        NotificationCategory category, Boolean unreadOnly, Instant from, Instant to) {

    public boolean onlyUnread() {
        return Boolean.TRUE.equals(unreadOnly);
    }
}
