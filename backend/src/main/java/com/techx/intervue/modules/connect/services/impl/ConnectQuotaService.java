package com.techx.intervue.modules.connect.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.connect.services.interfaces.ConnectQuotaServiceInterface;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ConnectQuotaService implements ConnectQuotaServiceInterface {

    private static final String PREFIX = "connect:quota:invite:";
    private static final int MAX_DAILY_INVITES = 100;
    private static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

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

    private final StringRedisTemplate redis;

    @Override
    public void reserve(Long recruiterId) {
        ZonedDateTime now = ZonedDateTime.now(VIETNAM_ZONE);
        String key = PREFIX + recruiterId + ":" + now.toLocalDate();
        long secondsToMidnight =
                Duration.between(now, now.toLocalDate().plusDays(1).atStartOfDay(VIETNAM_ZONE))
                        .toSeconds();
        Long retryAfterSeconds =
                redis.execute(
                        RESERVE,
                        List.of(key),
                        String.valueOf(MAX_DAILY_INVITES),
                        String.valueOf(secondsToMidnight));
        if (retryAfterSeconds != null && retryAfterSeconds > 0) {
            throw AppException.rateLimited(ErrorCode.CONNECTION_QUOTA_EXCEEDED, retryAfterSeconds);
        }
    }
}
