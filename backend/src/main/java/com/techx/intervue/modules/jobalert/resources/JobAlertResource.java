package com.techx.intervue.modules.jobalert.resources;

import com.techx.intervue.modules.jobalert.enums.AlertFrequency;
import java.time.Instant;

public record JobAlertResource(
        Long id,
        Long userId,
        String title,
        String keyword,
        String city,
        String careerLevel,
        String workMode,
        Long salaryMin,
        String currency,
        AlertFrequency frequency,
        boolean isActive,
        String unsubscribeToken,
        Instant lastSentAt,
        Instant createdAt,
        Instant updatedAt,
        long deliveredCount) {}
