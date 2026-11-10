package com.techx.intervue.modules.billing.services.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import org.springframework.stereotype.Component;

@Component
public class OrderPricing {

    public record Totals(
            long subtotal,
            long discountAmount,
            long subtotalAfterDiscount,
            long vatAmount,
            long totalAmount) {}

    public Totals compute(long subtotal, long discountAmount, BigDecimal vatRate) {
        long afterDiscount = Math.max(0, subtotal - discountAmount);
        long vatAmount = round(BigDecimal.valueOf(afterDiscount).multiply(vatRate));
        return new Totals(
                subtotal, discountAmount, afterDiscount, vatAmount, afterDiscount + vatAmount);
    }

    private long round(BigDecimal value) {
        return value.setScale(0, RoundingMode.HALF_UP).longValueExact();
    }
}
