package com.techx.intervue.modules.notification.resources;

import com.techx.intervue.modules.notification.enums.NotificationCategory;

public record NotificationPreferenceResource(
        NotificationCategory category, boolean inApp, boolean email, boolean mandatory) {}
