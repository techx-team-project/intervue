package com.techx.intervue.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ai")
public record AiProperties(Gemini gemini, Voyage voyage, Quota quota) {

    public record Gemini(
            String apiKey,
            String baseUrl,
            String model,
            int maxTokens,
            Duration timeout,
            int maxRetries) {}

    public record Voyage(
            String apiKey, String baseUrl, String model, Duration timeout, int maxRetries) {}

    public record Quota(int userPerDay, int ipPerHour) {}
}
