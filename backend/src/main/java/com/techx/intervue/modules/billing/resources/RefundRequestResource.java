package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.RefundStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
public record RefundRequestResource(
        Long id,
        String orderCode,
        Long companyId,
        String companyName,
        String reason,
        RefundStatus status,
        Long orderTotal,
        Long refundableAmount,
        Long approvedAmount,
        String adminNote,
        Instant reviewedAt,
        Instant createdAt) {}
