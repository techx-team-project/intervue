package com.techx.intervue.modules.entitlement.resources;

import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import com.techx.intervue.modules.entitlement.enums.EntitlementUsageStatus;
import java.time.Instant;

public record EntitlementUsageResource(
        Long id,
        EntitlementType entitlementType,
        String label,
        Long jobId,
        Integer quantity,
        Instant startedAt,
        Instant endsAt,
        EntitlementUsageStatus status) {}
