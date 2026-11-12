package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.entitlement.enums.EntitlementStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
public record AdminCompanyCreditLotResource(
        Long id,
        Long sourceOrderItemId,
        String label,
        int totalQuantity,
        int remainingQuantity,
        boolean bonus,
        EntitlementStatus status,
        Instant activationDeadline,
        Instant createdAt) {}
