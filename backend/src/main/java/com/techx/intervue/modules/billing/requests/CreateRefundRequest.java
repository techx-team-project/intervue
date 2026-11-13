package com.techx.intervue.modules.billing.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateRefundRequest(
        @NotBlank @Size(max = 1000) String reason,
        @NotBlank String bankCode,
        @NotBlank String bankAccountNumber,
        @NotBlank @Size(max = 150) String bankAccountName) {}
