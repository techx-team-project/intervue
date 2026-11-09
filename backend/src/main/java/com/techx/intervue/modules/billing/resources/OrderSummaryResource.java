package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.OrderStatus;
import java.time.Instant;

public record OrderSummaryResource(
        Long id,
        String code,
        OrderStatus status,
        Long totalAmount,
        String currency,
        Integer itemCount,
        Instant expiresAt,
        Instant createdAt) {}
