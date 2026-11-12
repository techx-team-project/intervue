package com.techx.intervue.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ai")
public record AiProperties(
        String provider, Gemini gemini, OpenAi openai, Embedding embedding, Quota quota) {

    public record Gemini(
            String apiKey,
            String baseUrl,
            String model,
            int maxTokens,
            Duration timeout,
            int maxRetries) {}

    public record OpenAi(
            String apiKey,
            String baseUrl,
            String model,
            int maxTokens,
            Duration timeout,
            int maxRetries) {}

    public record Embedding(String model, int dimensions) {}

    public record Quota(int userPerDay, int resumeMatchFreePerMonth, int jdGenerateFreePerMonth) {}
}
