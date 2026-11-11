package com.techx.intervue.modules.billing.requests;

import com.techx.intervue.modules.billing.enums.OrderStatus;
import java.time.Instant;

public record SearchAdminOrdersRequest(
        String code,
        OrderStatus status,
        Long companyId,
        Instant from,
        Instant to,
        Boolean needsManualRefund) {}
