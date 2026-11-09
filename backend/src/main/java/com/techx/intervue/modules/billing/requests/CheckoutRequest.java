package com.techx.intervue.modules.billing.requests;

import com.techx.intervue.modules.billing.enums.InvoiceType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CheckoutRequest(
        Long packageId,
        @Min(1) @Max(99) Integer quantity,
        @NotNull InvoiceType invoiceType,
        @Size(max = 30) String taxId,
        @Size(max = 255) String companyName,
        @Size(max = 500) String companyAddress,
        @Size(max = 150) String fullName,
        @Size(max = 30) String identityNumber,
        @Size(max = 500) String personalAddress,
        @NotBlank @Email @Size(max = 255) String recipientEmail,
        @NotNull Boolean termsAccepted) {

    @AssertTrue(message = "You must accept the service terms")
    public boolean isTermsAccepted() {
        return Boolean.TRUE.equals(termsAccepted);
    }

    @AssertTrue(message = "Tax code and company name are required for a business invoice")
    public boolean isBusinessInvoiceComplete() {
        if (invoiceType != InvoiceType.BUSINESS) {
            return true;
        }
        return taxId != null && !taxId.isBlank() && companyName != null && !companyName.isBlank();
    }

    @AssertTrue(message = "Full name is required for a personal invoice")
    public boolean isPersonalInvoiceComplete() {
        if (invoiceType != InvoiceType.PERSONAL) {
            return true;
        }
        return fullName != null && !fullName.isBlank();
    }
}
