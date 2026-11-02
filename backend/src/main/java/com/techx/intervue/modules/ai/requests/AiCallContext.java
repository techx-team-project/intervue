package com.techx.intervue.modules.ai.requests;

import java.util.Objects;

public record AiCallContext(String feature, Long userId, String ip, boolean chargeQuota) {

    public AiCallContext(String feature, Long userId, String ip) {
        this(feature, userId, ip, true);
    }

    public AiCallContext {
        Objects.requireNonNull(feature, "feature is required");
        if (ip == null || ip.isBlank()) {
            throw new IllegalArgumentException("ip is required");
        }
    }
}
