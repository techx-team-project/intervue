package com.techx.intervue.modules.billing.requests;

import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record ReviewRefundRequest(
        @PositiveOrZero Long approvedAmount, @Size(max = 500) String adminNote) {}
