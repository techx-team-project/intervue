package com.techx.intervue.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "billing")
public record BillingProperties(Boolean requireJobSlot, Seller seller) {

    /** Printed on every invoice. Blank fields are simply left off the document. */
    public record Seller(String name, String taxCode, String address, String email, String phone) {}

    public BillingProperties {
        seller = seller == null ? new Seller(null, null, null, null, null) : seller;
    }

    public boolean requiresJobSlot() {
        return Boolean.TRUE.equals(requireJobSlot);
    }
}
