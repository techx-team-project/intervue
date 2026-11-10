package com.techx.intervue.modules.billing.resources;

import java.math.BigDecimal;
import java.time.Instant;

public record BillingSettingsResource(
        BigDecimal vatRate,
        Integer orderExpireHours,
        String orderCodePrefix,
        Integer maxPendingOrders,
        String bankCode,
        String bankAccountNumber,
        String bankAccountName,
        Boolean paymentSyncEnabled,
        Instant paymentSyncSince,
        boolean apiTokenConfigured) {}
