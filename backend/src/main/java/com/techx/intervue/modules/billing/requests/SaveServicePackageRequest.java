package com.techx.intervue.modules.billing.requests;

import com.techx.intervue.modules.billing.enums.ServicePackageBadge;
import com.techx.intervue.modules.billing.enums.ServicePackageStatus;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.List;

public record SaveServicePackageRequest(
        @NotNull Long categoryId,
        @NotBlank @Size(max = 50) @Pattern(regexp = "^[A-Z0-9_]+$") String code,
        @NotBlank @Size(max = 120) @Pattern(regexp = "^[a-z0-9-]+$") String slug,
        @NotBlank @Size(max = 150) String name,
        @Size(max = 1000) String shortDescription,
        @NotNull @PositiveOrZero Long price,
        @Size(max = 3) String currency,
        @NotNull ServicePackageBadge badge,
        @NotNull Boolean vipRibbon,
        @Size(max = 20) String accentColor,
        @Size(max = 500) String heroImageUrl,
        @Positive Integer validityDays,
        @NotNull @PositiveOrZero Integer bonusCredits,
        @NotNull Boolean oneTimePerCompany,
        @NotNull ServicePackageStatus status,
        @NotNull @PositiveOrZero Integer displayOrder,
        @Valid List<Benefit> benefits,
        @Valid List<Section> sections) {

    public record Benefit(
            @NotNull EntitlementType entitlementType,
            @NotNull @Positive Integer quantity,
            @NotNull @Min(1) @Max(5) Integer tier,
            @Positive Integer durationDays,
            @NotBlank @Size(max = 255) String label) {}

    public record Section(
            @NotBlank @Size(max = 255) String heading,
            @Size(max = 50) String iconName,
            @Size(max = 20) String accentColor,
            String body,
            @Size(max = 500) String imageUrl) {}
}
