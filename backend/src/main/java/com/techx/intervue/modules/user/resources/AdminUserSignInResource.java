package com.techx.intervue.modules.user.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record AdminUserSignInResource(
        Long id,
        Instant at,
        String deviceLabel,
        String ipAddress,
        String location,
        String outcome) {}
