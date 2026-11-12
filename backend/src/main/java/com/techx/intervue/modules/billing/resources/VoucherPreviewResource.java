package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.VoucherAccentColor;
import com.techx.intervue.modules.billing.enums.VoucherDiscountType;
import java.util.List;
import lombok.Builder;

@Builder
public record VoucherPreviewResource(
        String code,
        String label,
        String description,
        String ribbonLabel,
        VoucherAccentColor accentColor,
        List<String> conditions,
        List<VoucherPackageSummaryResource> applicablePackages,
        VoucherDiscountType discountType,
        Long discountValue,
        Long discountAmount,
        Long subtotal,
        Long subtotalAfterDiscount) {}
