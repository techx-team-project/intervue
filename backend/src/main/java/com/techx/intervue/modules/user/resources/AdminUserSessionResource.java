package com.techx.intervue.modules.user.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record AdminUserSessionResource(
        Long id,
        Instant createdAt,
        Instant expiresAt,
        boolean revoked,
        Long replacedByTokenId,
        String deviceLabel,
        String ipAddress,
        boolean isCurrent) {}
