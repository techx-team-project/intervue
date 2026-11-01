package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.config.AiProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.services.interfaces.AiQuotaServiceInterface;
import java.time.Duration;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiQuotaService implements AiQuotaServiceInterface {

    private static final String PREFIX = "ai:quota:";
    private static final Duration USER_WINDOW = Duration.ofDays(1);
    private static final Duration IP_WINDOW = Duration.ofHours(1);

    // Returns 0 when a slot was taken, otherwise the seconds until the window resets.
    private static final RedisScript<Long> RESERVE =
            new DefaultRedisScript<>(
                    """
                    local count = redis.call('INCR', KEYS[1])
                    if redis.call('TTL', KEYS[1]) < 0 then
                        redis.call('EXPIRE', KEYS[1], ARGV[2])
                    end
                    if count > tonumber(ARGV[1]) then
                        redis.call('DECR', KEYS[1])
                        return math.max(redis.call('TTL', KEYS[1]), 1)
                    end
                    return 0
                    """,
                    Long.class);

    private static final RedisScript<Long> RELEASE =
            new DefaultRedisScript<>(
                    """
                    local count = tonumber(redis.call('GET', KEYS[1]) or '0')
                    if count > 0 then
                        redis.call('DECR', KEYS[1])
                    end
                    return 0
                    """,
                    Long.class);

    private final StringRedisTemplate redis;
    private final AiProperties properties;

    @Override
    public void reserve(Long userId, String ip) {
        if (userId == null) {
            reserveIp(ip);
            return;
        }
        String userKey = userKey(userId);
        reserveSlot(
                userKey,
                properties.quota().userPerDay(),
                USER_WINDOW,
                ErrorCode.AI_USER_QUOTA_EXCEEDED);
        try {
            reserveIp(ip);
        } catch (AppException ex) {
            releaseSlot(userKey);
            throw ex;
        }
    }

    @Override
    public void release(Long userId, String ip) {
        if (userId != null) {
            releaseSlot(userKey(userId));
        }
        releaseSlot(ipKey(ip));
    }

    private void reserveIp(String ip) {
        reserveSlot(
                ipKey(ip),
                properties.quota().ipPerHour(),
                IP_WINDOW,
                ErrorCode.AI_IP_QUOTA_EXCEEDED);
    }

    private void reserveSlot(String key, int limit, Duration window, ErrorCode exceededCode) {
        Long retryAfterSeconds =
                redis.execute(
                        RESERVE,
                        List.of(key),
                        String.valueOf(limit),
                        String.valueOf(window.toSeconds()));
        if (retryAfterSeconds != null && retryAfterSeconds > 0) {
            throw AppException.rateLimited(exceededCode, retryAfterSeconds);
        }
    }

    private void releaseSlot(String key) {
        redis.execute(RELEASE, List.of(key));
    }

    private String userKey(Long userId) {
        return PREFIX + "user:" + userId;
    }

    private String ipKey(String ip) {
        return PREFIX + "ip:" + ip;
    }
}
