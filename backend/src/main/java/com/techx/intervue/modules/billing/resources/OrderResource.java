package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResource(
        Long id,
        String code,
        OrderStatus status,
        Long subtotal,
        Long discountAmount,
        Long subtotalAfterDiscount,
        BigDecimal vatRate,
        Long vatAmount,
        Long totalAmount,
        Long paidAmount,
        String currency,
        Instant expiresAt,
        Instant paidAt,
        Instant cancelledAt,
        Instant createdAt,
        List<OrderItemResource> items,
        OrderInvoiceDetailResource invoice) {}
