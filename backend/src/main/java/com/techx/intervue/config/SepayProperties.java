package com.techx.intervue.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "sepay")
public record SepayProperties(
        String baseUrl, String qrBaseUrl, String apiToken, Duration timeout, Sync sync) {

    public record Sync(String cron, Integer limit) {}
}
