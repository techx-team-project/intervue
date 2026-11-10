package com.techx.intervue.modules.billing.requests;

import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ConvertCreditsRequest(
        @NotNull EntitlementType entitlementType,
        @NotNull @Min(1) @Max(5) Integer tier,
        @NotNull @Min(1) @Max(50) Integer quantity) {}
