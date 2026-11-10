package com.techx.intervue.modules.billing.resources;

import com.techx.intervue.modules.billing.enums.InvoiceType;

public record OrderInvoiceDetailResource(
        InvoiceType invoiceType,
        String taxId,
        String companyName,
        String companyAddress,
        String fullName,
        String identityNumber,
        String personalAddress,
        String recipientEmail) {}
