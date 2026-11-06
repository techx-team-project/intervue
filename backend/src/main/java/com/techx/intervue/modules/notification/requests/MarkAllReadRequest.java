package com.techx.intervue.modules.notification.requests;

import com.techx.intervue.modules.notification.enums.NotificationCategory;

public record MarkAllReadRequest(NotificationCategory category) {}
