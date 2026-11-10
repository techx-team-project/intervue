package com.techx.intervue.modules.billing.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record SaveServiceCategoryRequest(
        @NotBlank @Size(max = 50) @Pattern(regexp = "^[A-Z0-9_]+$") String code,
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 255) String headline,
        @Size(max = 500) String description,
        @Size(max = 50) String needKey,
        @NotNull @PositiveOrZero Integer displayOrder,
        @NotNull Boolean isActive) {}
