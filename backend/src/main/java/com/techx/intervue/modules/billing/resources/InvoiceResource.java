package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.InvoiceType;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.Builder;

@Builder
public record InvoiceResource(
        Long id,
        String number,
        String orderCode,
        Instant issuedAt,
        InvoiceType invoiceType,
        String buyerName,
        String buyerTaxId,
        String recipientEmail,
        Long subtotal,
        Long discountAmount,
        BigDecimal vatRate,
        Long vatAmount,
        Long totalAmount,
        String currency) {}
