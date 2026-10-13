package com.techx.intervue.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.services.interfaces.RateLimitServiceInterface;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RateLimitRedisService implements RateLimitServiceInterface {

    private static final String PREFIX = "rl:";

    private final StringRedisTemplate redis;

    @Override
    public void enforce(
            String route, String subject, Duration cooldown, int maxInWindow, Duration window) {
        enforceCooldown(PREFIX + route + ":cd:" + subject, cooldown);
        enforceWindow(PREFIX + route + ":win:" + subject, maxInWindow, window);
    }

    private void enforceCooldown(String key, Duration cooldown) {
        if (!Boolean.TRUE.equals(redis.opsForValue().setIfAbsent(key, "1", cooldown))) {
            throw AppException.rateLimited(remainingSeconds(key, cooldown));
        }
    }

    private void enforceWindow(String key, int maxInWindow, Duration window) {
        Long count = redis.opsForValue().increment(key);
        if (count != null && count == 1) {
            redis.expire(key, window);
        }
        if (count != null && count > maxInWindow) {
            throw AppException.rateLimited(remainingSeconds(key, window));
        }
    }

    private long remainingSeconds(String key, Duration fallback) {
        Long ttl = redis.getExpire(key);
        return ttl != null && ttl > 0 ? ttl : fallback.toSeconds();
    }
}
