package com.techx.intervue.modules.ai.requests;

import java.util.Objects;

public record AiCallContext(String feature, Long userId, String ip) {

    public AiCallContext {
        Objects.requireNonNull(feature, "feature is required");
        if (ip == null || ip.isBlank()) {
            throw new IllegalArgumentException("ip is required");
        }
    }
}
