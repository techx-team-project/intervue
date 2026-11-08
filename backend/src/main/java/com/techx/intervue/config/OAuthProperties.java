package com.techx.intervue.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "oauth")
public record OAuthProperties(Google google) {

    public record Google(String clientId, String clientSecret) {}
}
