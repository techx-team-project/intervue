package com.techx.intervue.modules.ads.resources;

import lombok.Builder;

@Builder
public record AdSlotResource(
        Long id,
        String code,
        String name,
        String placement,
        String description,
        Integer width,
        Integer height,
        Long pricePerWeek,
        String packageSlug,
        boolean active) {}
