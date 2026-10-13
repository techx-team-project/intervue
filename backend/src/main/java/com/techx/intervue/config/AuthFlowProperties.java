package com.techx.intervue.config;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "auth")
public record AuthFlowProperties(
        Duration emailVerificationTtl,
        Duration passwordResetTtl,
        Duration resendCooldown,
        int resendMaxAttempts,
        Duration resendWindow,
        int loginFailThreshold,
        Duration loginFailWindow) {}
