package com.techx.intervue.modules.ads.resources;

import com.techx.intervue.modules.ads.enums.AdBookingStatus;
import com.techx.intervue.modules.ads.enums.AdCreativeStatus;
import java.time.LocalDate;
import lombok.Builder;

@Builder
public record RecruiterAdBookingResource(
        Long id,
        String slotCode,
        String slotName,
        Integer width,
        Integer height,
        LocalDate weekStart,
        LocalDate weekEnd,
        AdBookingStatus status,
        boolean running,
        AdCreativeStatus creativeStatus,
        String creativeImageUrl,
        String creativeTargetUrl,
        String rejectionReason,
        Integer impressions,
        Integer clicks) {}
