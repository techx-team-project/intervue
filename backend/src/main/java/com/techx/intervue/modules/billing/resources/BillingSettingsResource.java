package com.techx.intervue.modules.billing.resources;

import java.math.BigDecimal;

public record BillingSettingsResource(
        BigDecimal vatRate,
        Integer orderExpireHours,
        String orderCodePrefix,
        Integer maxPendingOrders,
        String bankCode,
        String bankAccountNumber,
        String bankAccountName,
        Boolean paymentSyncEnabled,
        boolean apiTokenConfigured) {}
