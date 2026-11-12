package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.VoucherAccentColor;
import com.techx.intervue.modules.billing.enums.VoucherDiscountType;
import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
public record AvailableVoucherResource(
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
        Integer remainingUses,
        Integer perCompanyLimit,
        Long usedByCompanyCount) {}
