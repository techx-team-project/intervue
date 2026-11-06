package com.techx.intervue.modules.jobalert.resources;

import com.techx.intervue.modules.jobalert.enums.AlertFrequency;

public record JobAlertUnsubscribeResource(
        Long alertId,
        String title,
        String keyword,
        String city,
        AlertFrequency frequency,
        boolean isActive,
        String token) {}
