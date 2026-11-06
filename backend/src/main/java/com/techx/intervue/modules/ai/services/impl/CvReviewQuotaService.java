package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.resources.CvReviewQuotaResource;
import com.techx.intervue.modules.ai.services.interfaces.CvReviewQuotaServiceInterface;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CvReviewQuotaService implements CvReviewQuotaServiceInterface {

    public static final ZoneId VIETNAM_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    public static final int MAX_DAILY_USES = 3;
    private static final String QUOTA_KEY_PREFIX = "ai:quota:cv_review:";

    private final StringRedisTemplate redis;

    @Override
    public CvReviewQuotaResource getQuota(Long candidateUserId) {
        if (candidateUserId == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        ZonedDateTime nowVietnam = ZonedDateTime.now(VIETNAM_ZONE);
        String dateStr = nowVietnam.toLocalDate().toString();
        ZonedDateTime nextMidnight =
                nowVietnam.toLocalDate().plusDays(1).atStartOfDay(VIETNAM_ZONE);

        String key = buildKey(candidateUserId, dateStr);
        String val = redis.opsForValue().get(key);
        int used = val != null ? Integer.parseInt(val) : 0;
        int remaining = Math.max(0, MAX_DAILY_USES - used);

        return CvReviewQuotaResource.builder()
                .usedToday(used)
                .remaining(remaining)
                .maxDaily(MAX_DAILY_USES)
                .resetAt(nextMidnight.toInstant())
                .build();
    }

    @Override
    public void checkAndConsumeQuota(Long candidateUserId) {
        if (candidateUserId == null) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        ZonedDateTime nowVietnam = ZonedDateTime.now(VIETNAM_ZONE);
        String dateStr = nowVietnam.toLocalDate().toString();
        ZonedDateTime nextMidnight =
                nowVietnam.toLocalDate().plusDays(1).atStartOfDay(VIETNAM_ZONE);
        Duration ttl = Duration.between(nowVietnam, nextMidnight);

        String key = buildKey(candidateUserId, dateStr);
        Long count = redis.opsForValue().increment(key);

        if (count != null && count == 1) {
            redis.expire(key, ttl);
        }

        if (count != null && count > MAX_DAILY_USES) {
            redis.opsForValue().decrement(key);
            log.warn(
                    "Candidate {} exceeded daily AI CV review quota (used: {}, max: {})",
                    candidateUserId,
                    count - 1,
                    MAX_DAILY_USES);
            throw new AppException(ErrorCode.AI_USER_QUOTA_EXCEEDED);
        }
    }

    @Override
    public void releaseQuota(Long candidateUserId) {
        if (candidateUserId == null) return;
        ZonedDateTime nowVietnam = ZonedDateTime.now(VIETNAM_ZONE);
        String dateStr = nowVietnam.toLocalDate().toString();
        String key = buildKey(candidateUserId, dateStr);
        try {
            Long count = redis.opsForValue().decrement(key);
            if (count != null && count < 0) {
                redis.opsForValue().set(key, "0");
            }
        } catch (Exception e) {
            log.warn("Failed to release quota for user {}: {}", candidateUserId, e.getMessage());
        }
    }

    private String buildKey(Long userId, String dateStr) {
        return QUOTA_KEY_PREFIX + userId + ":" + dateStr;
    }
}
