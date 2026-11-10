package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.OrderStatus;
import java.time.Instant;

public record OrderPaymentResource(
        String orderCode,
        OrderStatus status,
        Long totalAmount,
        Long paidAmount,
        String currency,
        Instant expiresAt,
        boolean configured,
        String bankCode,
        String accountNumber,
        String accountName,
        String transferContent,
        String qrUrl) {}
