package com.techx.intervue.modules.ads.resources;

import com.techx.intervue.modules.ads.enums.AdCreativeStatus;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Builder;

@Builder
public record AdminAdCreativeResource(
        Long id,
        Long bookingId,
        String slotCode,
        String slotName,
        Integer width,
        Integer height,
        Long companyId,
        LocalDate weekStart,
        LocalDate weekEnd,
        String imageUrl,
        String targetUrl,
        String altText,
        AdCreativeStatus status,
        String rejectionReason,
        Instant reviewedAt,
        Instant createdAt) {}
