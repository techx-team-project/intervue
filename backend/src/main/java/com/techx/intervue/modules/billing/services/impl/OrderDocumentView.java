package com.techx.intervue.modules.billing.services.impl;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * What {@link InvoicePdfRenderer} draws — the real, numbered VAT invoice once an order is paid, or
 * a non-numbered order confirmation for a recruiter to show their finance team before payment (or
 * after cancellation). The two never share a document number: a number implies money was received.
 */
record OrderDocumentView(
        String documentTitle,
        String documentNumber,
        /**
         * Shown under the title for a not-yet-numbered document, e.g. "AWAITING PAYMENT"; null for
         * a real invoice.
         */
        String statusLabel,
        float[] statusColor,
        String orderCode,
        Instant issuedAt,
        String buyerName,
        String buyerTaxId,
        String buyerAddress,
        String recipientEmail,
        long subtotal,
        long discountAmount,
        BigDecimal vatRate,
        long vatAmount,
        long totalAmount,
        String currency,
        String totalsLabel,
        String notice) {}
