package com.techx.intervue.modules.user.resources;

import lombok.Builder;

@Builder
public record AdminUserSummaryResource(
        long total,
        long active,
        long banned,
        long unverified,
        long newLast7Days,
        long activeLast7Days,
        long candidates,
        long recruiters,
        long admins,
        long activeAdminCount,
        long bannedOverAWeek,
        long unverifiedOverAWeek,
        long grantsExpiringIn14Days) {}
