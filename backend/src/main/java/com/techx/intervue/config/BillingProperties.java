package com.techx.intervue.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "billing")
public record BillingProperties(Boolean requireJobSlot) {

    public boolean requiresJobSlot() {
        return Boolean.TRUE.equals(requireJobSlot);
    }
}
