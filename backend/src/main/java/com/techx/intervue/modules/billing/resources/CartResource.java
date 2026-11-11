package com.techx.intervue.modules.billing.resources;

import java.math.BigDecimal;
import java.util.List;

public record CartResource(
        List<CartItemResource> items,
        Long subtotal,
        BigDecimal vatRate,
        Long vatAmount,
        Long totalAmount,
        String currency) {}
