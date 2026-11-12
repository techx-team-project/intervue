package com.techx.intervue.modules.billing.requests;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdjustCompanyCreditsRequest(
        @NotNull @Min(-1_000_000) @Max(1_000_000) Integer amount,
        @NotBlank @Size(max = 200) String reason,
        @Min(1) @Max(3650) Integer validityDays) {}
