package com.techx.intervue.modules.notification.resources;

import com.techx.intervue.modules.notification.enums.NotificationCategory;
import java.util.Map;

public record UnreadCountResource(long total, Map<NotificationCategory, Long> byCategory) {}
