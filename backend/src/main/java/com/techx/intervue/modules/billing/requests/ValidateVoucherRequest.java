package com.techx.intervue.modules.billing.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ValidateVoucherRequest(
        @NotBlank @Size(max = 40) String code,
        Long packageId,
        Integer quantity,
        List<Long> cartItemIds) {}
