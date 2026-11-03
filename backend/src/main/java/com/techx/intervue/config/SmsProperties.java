package com.techx.intervue.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "sms")
public record SmsProperties(Esms esms) {

    public record Esms(
            String baseUrl,
            String apiKey,
            String secretKey,
            String brandname,
            String smsType,
            Duration timeout) {}
}
