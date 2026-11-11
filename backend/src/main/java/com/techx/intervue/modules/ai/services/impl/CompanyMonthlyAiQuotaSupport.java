package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CompanyMonthlyAiQuotaSupport {

    private static final ZoneId VIETNAM = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter PERIOD = DateTimeFormatter.ofPattern("yyyy-MM");

    private final StringRedisTemplate redis;
    private final CompanyServiceInterface companyService;
    private final EntitlementServiceInterface entitlementService;

    public record QuotaSnapshot(
            int freeUsedThisMonth,
            int freeLimit,
            int freeRemaining,
            int paidRemaining,
            int totalRemaining,
            Instant resetAt) {}

    public QuotaSnapshot snapshot(
            Long recruiterUserId,
            String keyPrefix,
            EntitlementType entitlementType,
            int freeLimit) {
        Long companyId = requireCompanyId(recruiterUserId);
        int normalizedLimit = Math.max(0, freeLimit);
        int used = freeUsed(keyPrefix, companyId);
        int freeRemaining = Math.max(0, normalizedLimit - used);
        int paidRemaining = entitlementService.remainingOf(companyId, entitlementType);
        return new QuotaSnapshot(
                used,
                normalizedLimit,
                freeRemaining,
                paidRemaining,
                freeRemaining + paidRemaining,
                nextPeriodStart().toInstant());
    }

    public void assertHasQuota(
            Long recruiterUserId,
            String keyPrefix,
            EntitlementType entitlementType,
            int freeLimit) {
        if (snapshot(recruiterUserId, keyPrefix, entitlementType, freeLimit).totalRemaining()
                <= 0) {
            throw new AppException(ErrorCode.AI_USER_QUOTA_EXCEEDED);
        }
    }

    public void consume(
            Long recruiterUserId,
            String keyPrefix,
            EntitlementType entitlementType,
            int freeLimit) {
        Long companyId = requireCompanyId(recruiterUserId);
        if (consumeFree(keyPrefix, companyId, Math.max(0, freeLimit))) {
            return;
        }
        if (!entitlementService.consumeUnit(companyId, entitlementType)) {
            log.warn(
                    "Company {} ran out of {} quota between check and consume",
                    companyId,
                    entitlementType);
        }
    }

    private boolean consumeFree(String keyPrefix, Long companyId, int freeLimit) {
        if (freeLimit <= 0) {
            return false;
        }
        String key = key(keyPrefix, companyId);
        Long count = redis.opsForValue().increment(key);
        if (count != null && count == 1) {
            redis.expire(key, Duration.between(ZonedDateTime.now(VIETNAM), nextPeriodStart()));
        }
        if (count != null && count <= freeLimit) {
            return true;
        }
        redis.opsForValue().decrement(key);
        return false;
    }

    private int freeUsed(String keyPrefix, Long companyId) {
        String value = redis.opsForValue().get(key(keyPrefix, companyId));
        return value == null ? 0 : Integer.parseInt(value);
    }

    private ZonedDateTime nextPeriodStart() {
        return ZonedDateTime.now(VIETNAM)
                .toLocalDate()
                .withDayOfMonth(1)
                .plusMonths(1)
                .atStartOfDay(VIETNAM);
    }

    private String key(String keyPrefix, Long companyId) {
        return keyPrefix + companyId + ":" + PERIOD.format(ZonedDateTime.now(VIETNAM));
    }

    private Long requireCompanyId(Long recruiterUserId) {
        try {
            return companyService.findMyCompany(recruiterUserId).id();
        } catch (AppException cause) {
            if (cause.getErrorCode() == ErrorCode.NOT_FOUND) {
                throw new AppException(ErrorCode.NOT_COMPANY_MEMBER);
            }
            throw cause;
        }
    }
}
