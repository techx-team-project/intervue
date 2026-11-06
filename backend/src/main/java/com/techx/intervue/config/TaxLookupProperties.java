package com.techx.intervue.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "tax-lookup")
public record TaxLookupProperties(String baseUrl, Duration timeout, Duration retryAfter) {}
