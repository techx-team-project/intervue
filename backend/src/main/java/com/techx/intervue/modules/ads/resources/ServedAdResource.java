package com.techx.intervue.modules.ads.resources;

import lombok.Builder;

@Builder
public record ServedAdResource(
        String slotCode,
        Integer width,
        Integer height,
        String imageUrl,
        String targetUrl,
        String altText,
        /** A house ad is InterVue's own promo, shown so the slot is never blank. */
        boolean house,
        Long bookingId) {}
