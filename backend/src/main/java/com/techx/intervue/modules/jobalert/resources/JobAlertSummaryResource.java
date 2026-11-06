package com.techx.intervue.modules.jobalert.resources;

public record JobAlertSummaryResource(
        long totalAlerts, long activeAlerts, long pausedAlerts, long totalDeliveries) {}
