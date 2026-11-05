package com.techx.intervue.modules.recruiter.resources;

import java.time.Instant;

public record RecruiterTrustedDeviceResource(
        Long id,
        String deviceName,
        String ipAddress,
        Instant lastUsedAt,
        Instant expiresAt,
        boolean current) {}
