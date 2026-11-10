package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.OrderStatus;
import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
public record AdminOrderResource(
        Long id,
        String code,
        OrderStatus status,
        Long companyId,
        String companyName,
        Long subtotal,
        Long discountAmount,
        Long vatAmount,
        Long totalAmount,
        Long paidAmount,
        String currency,
        String invoiceNumber,
        Instant expiresAt,
        Instant paidAt,
        Instant createdAt,
        Instant manualRefundResolvedAt,
        List<OrderItemResource> items) {}
