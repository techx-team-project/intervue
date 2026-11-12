package com.techx.intervue.modules.billing.requests;

import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record CreateCreditPriceRequest(
        @NotNull EntitlementType entitlementType,
        @NotNull @Min(1) @Max(3) Integer tier,
        @NotNull @Positive @Max(1_000_000) Integer creditCost,
        @Min(1) @Max(3650) Integer durationDays,
        @NotBlank @Size(max = 255) String label,
        @NotNull Boolean active,
        @NotNull @PositiveOrZero Integer displayOrder) {}
