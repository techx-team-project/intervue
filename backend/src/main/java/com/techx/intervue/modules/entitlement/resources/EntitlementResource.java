package com.techx.intervue.modules.entitlement.resources;

import com.techx.intervue.modules.entitlement.enums.EntitlementStatus;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import java.time.Instant;

public record EntitlementResource(
        Long id,
        EntitlementType entitlementType,
        String label,
        Integer totalQuantity,
        Integer remainingQuantity,
        Integer durationDays,
        EntitlementStatus status,
        Instant activationDeadline,
        Long purchasedByRecruiterId,
        boolean activatable,
        Instant purchasedAt) {}
