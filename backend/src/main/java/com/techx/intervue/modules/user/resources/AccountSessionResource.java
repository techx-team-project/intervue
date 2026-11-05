package com.techx.intervue.modules.user.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record AccountSessionResource(
        Long id,
        String deviceLabel,
        String ipAddress,
        String location,
        Instant createdAt,
        Instant lastUsedAt,
        boolean current) {}
