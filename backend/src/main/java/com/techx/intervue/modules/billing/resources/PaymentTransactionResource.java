package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.PaymentTransactionStatus;
import java.time.Instant;

public record PaymentTransactionResource(
        Long id,
        String sepayId,
        String gateway,
        String accountNumber,
        String content,
        Long amountIn,
        String referenceCode,
        Instant transactionAt,
        PaymentTransactionStatus status,
        String matchedOrderCode,
        String note) {}
