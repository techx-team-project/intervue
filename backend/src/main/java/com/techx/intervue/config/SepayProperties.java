package com.techx.intervue.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "sepay")
public record SepayProperties(
        String baseUrl,
        String qrBaseUrl,
        String apiToken,
        Duration timeout,
        Sync sync,
        DefaultBank defaultBank) {

    public record Sync(String cron, Integer limit) {}

    public record DefaultBank(String code, String accountNumber, String accountName) {}
}
