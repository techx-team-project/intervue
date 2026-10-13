package com.techx.intervue.services.interfaces;

import java.time.Duration;

public interface RateLimitServiceInterface {
    void enforce(String route, String subject, Duration cooldown, int maxInWindow, Duration window);
}
