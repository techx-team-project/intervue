package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.entitlement.enums.EntitlementType;

public record ServicePackageBenefitResource(
        EntitlementType entitlementType, Integer quantity, Integer durationDays, String label) {}
