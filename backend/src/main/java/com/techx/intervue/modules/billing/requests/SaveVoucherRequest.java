package com.techx.intervue.modules.billing.requests;

import com.techx.intervue.modules.billing.enums.VoucherDiscountType;
import com.techx.intervue.modules.billing.enums.VoucherStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record SaveVoucherRequest(
        @NotBlank @Size(max = 40) @Pattern(regexp = "^[A-Z0-9_-]+$") String code,
        @NotBlank @Size(max = 150) String label,
        @Size(max = 500) String description,
        @NotNull VoucherDiscountType discountType,
        @NotNull @Positive Long discountValue,
        @Positive Long maxDiscount,
        @NotNull @PositiveOrZero Long minOrderValue,
        Instant startsAt,
        Instant endsAt,
        @Positive Integer usageLimit,
        @Positive Integer perCompanyLimit,
        @NotNull VoucherStatus status) {}
