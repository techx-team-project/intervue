package com.techx.intervue.modules.application.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "applications")
public record ApplicationProperties(boolean requireIdentityVerification) {}
