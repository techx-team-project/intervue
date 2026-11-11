package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import lombok.Builder;

@Builder
public record CreditPriceResource(
        Long id,
        EntitlementType entitlementType,
        Integer tier,
        Integer creditCost,
        Integer durationDays,
        String label,
        boolean active,
        Integer displayOrder) {}
