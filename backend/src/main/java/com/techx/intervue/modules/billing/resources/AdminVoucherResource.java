package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.VoucherAccentColor;
import com.techx.intervue.modules.billing.enums.VoucherDiscountType;
import com.techx.intervue.modules.billing.enums.VoucherStatus;
import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
public record AdminVoucherResource(
        Long id,
        String code,
        String label,
        String description,
        String ribbonLabel,
        VoucherAccentColor accentColor,
        List<String> conditions,
        List<VoucherPackageSummaryResource> applicablePackages,
        VoucherDiscountType discountType,
        Long discountValue,
        Long maxDiscount,
        Long minOrderValue,
        Instant startsAt,
        Instant endsAt,
        Integer usageLimit,
        Integer usedCount,
        Integer perCompanyLimit,
        VoucherStatus status,
        Instant createdAt) {}
