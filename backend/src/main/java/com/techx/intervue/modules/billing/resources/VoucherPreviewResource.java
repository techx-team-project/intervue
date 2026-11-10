package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.VoucherDiscountType;
import lombok.Builder;

@Builder
public record VoucherPreviewResource(
        String code,
        String label,
        String description,
        VoucherDiscountType discountType,
        Long discountValue,
        Long discountAmount,
        Long subtotal,
        Long subtotalAfterDiscount) {}
