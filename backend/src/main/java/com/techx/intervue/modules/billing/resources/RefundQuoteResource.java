package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.RefundStatus;
import lombok.Builder;

@Builder
public record RefundQuoteResource(
        String orderCode,
        Long orderTotal,
        Long refundableAmount,
        boolean requestable,
        RefundStatus existingStatus) {}
