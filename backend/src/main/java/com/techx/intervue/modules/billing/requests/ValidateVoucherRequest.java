package com.techx.intervue.modules.billing.requests;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ValidateVoucherRequest(
        @NotBlank @Size(max = 40) String code,
        @Positive Long packageId,
        @Min(1) @Max(99) Integer quantity,
        List<@NotNull @Positive Long> cartItemIds) {}
