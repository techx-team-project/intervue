package com.techx.intervue.modules.ads.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record SaveAdSlotRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 500) String description,
        @NotNull @Positive Long pricePerWeek,
        @Size(max = 500) String houseImageUrl,
        @Size(max = 500) String houseTargetUrl,
        @NotNull Boolean active,
        @NotNull @PositiveOrZero Integer displayOrder) {}
