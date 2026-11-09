package com.techx.intervue.modules.billing.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MatchPaymentTransactionRequest(
        @NotBlank @Size(max = 20) String orderCode, @Size(max = 500) String note) {}
