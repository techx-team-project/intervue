package com.techx.intervue.modules.user.resources;

import java.time.Instant;
import java.util.Set;

public record AdminProfileResource(
        Long id,
        String name,
        String email,
        Set<String> roles,
        boolean twoFactorEnabled,
        Instant lastLoginAt,
        AdminQueueCountsResource queueCounts) {}
