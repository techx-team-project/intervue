package com.techx.intervue.modules.notification.templates;

public record NotificationTemplate(
        String title, String summary, String body, String actionLabel, String actionUrl) {}
