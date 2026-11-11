package com.techx.intervue.modules.ads.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record CreateAdSlotRequest(
        @NotBlank @Size(max = 40) @Pattern(regexp = "^[A-Z0-9_]+$") String code,
        @NotBlank @Size(max = 150) String name,
        @NotBlank @Pattern(regexp = "^(HOME|JOBS)$") String placement,
        @Size(max = 500) String description,
        @NotNull @Positive Integer width,
        @NotNull @Positive Integer height,
        @NotNull @Positive Long pricePerWeek,
        Long servicePackageId,
        @Size(max = 500) String houseImageUrl,
        @Size(max = 500) String houseTargetUrl,
        @NotNull Boolean active,
        @NotNull @PositiveOrZero Integer displayOrder) {}
