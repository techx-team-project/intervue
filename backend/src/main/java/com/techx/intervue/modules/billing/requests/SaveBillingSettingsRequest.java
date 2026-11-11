package com.techx.intervue.modules.billing.requests;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record SaveBillingSettingsRequest(
        @NotNull @DecimalMin("0.0") @DecimalMax("1.0") BigDecimal vatRate,
        @NotNull @Min(1) @Max(720) Integer orderExpireHours,
        @NotNull @Size(min = 2, max = 10) @Pattern(regexp = "^[A-Z]+$") String orderCodePrefix,
        @NotNull @Min(1) @Max(20) Integer maxPendingOrders,
        @Size(max = 30) String bankCode,
        @Size(max = 30) String bankAccountNumber,
        @Size(max = 150) String bankAccountName,
        @NotNull Boolean paymentSyncEnabled) {}
