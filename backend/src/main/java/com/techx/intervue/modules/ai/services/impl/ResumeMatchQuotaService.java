package com.techx.intervue.modules.ai.services.impl;

import com.techx.intervue.config.AiProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.resources.ResumeMatchQuotaResource;
import com.techx.intervue.modules.ai.services.interfaces.ResumeMatchQuotaServiceInterface;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.entitlement.enums.EntitlementType;
import com.techx.intervue.modules.entitlement.services.interfaces.EntitlementServiceInterface;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeMatchQuotaService implements ResumeMatchQuotaServiceInterface {

    private static final ZoneId VIETNAM = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter PERIOD = DateTimeFormatter.ofPattern("yyyy-MM");
    private static final String KEY_PREFIX = "ai:quota:resume_match:";

    private final StringRedisTemplate redis;
    private final AiProperties aiProperties;
    private final CompanyServiceInterface companyService;
    private final EntitlementServiceInterface entitlementService;

    @Override
    public ResumeMatchQuotaResource getQuota(Long recruiterUserId) {
        Long companyId = requireCompanyId(recruiterUserId);
        int limit = freeLimit();
        int used = freeUsed(companyId);
        int freeRemaining = Math.max(0, limit - used);
        int paidRemaining =
                entitlementService.remainingOf(companyId, EntitlementType.AI_RESUME_MATCH);

        return ResumeMatchQuotaResource.builder()
                .freeUsedThisMonth(used)
                .freeLimit(limit)
                .freeRemaining(freeRemaining)
                .paidRemaining(paidRemaining)
                .totalRemaining(freeRemaining + paidRemaining)
                .resetAt(nextPeriodStart().toInstant())
                .build();
    }

    @Override
    public void assertHasQuota(Long recruiterUserId) {
        if (getQuota(recruiterUserId).totalRemaining() <= 0) {
            throw new AppException(ErrorCode.AI_USER_QUOTA_EXCEEDED);
        }
    }

    // Checked before the model call and spent after it succeeds, so a failed analysis never
    // costs a paid unit. The per-user daily AI quota already blocks abuse of that gap.
    @Override
    public void consume(Long recruiterUserId) {
        Long companyId = requireCompanyId(recruiterUserId);
        if (consumeFree(companyId)) {
            return;
        }
        if (!entitlementService.consumeUnit(companyId, EntitlementType.AI_RESUME_MATCH)) {
            log.warn(
                    "Company {} ran out of resume match quota between check and consume",
                    companyId);
        }
    }

    private boolean consumeFree(Long companyId) {
        String key = key(companyId);
        Long count = redis.opsForValue().increment(key);
        if (count != null && count == 1) {
            redis.expire(key, Duration.between(ZonedDateTime.now(VIETNAM), nextPeriodStart()));
        }
        if (count != null && count <= freeLimit()) {
            return true;
        }
        redis.opsForValue().decrement(key);
        return false;
    }

    private int freeUsed(Long companyId) {
        String value = redis.opsForValue().get(key(companyId));
        return value == null ? 0 : Integer.parseInt(value);
    }

    private int freeLimit() {
        return Math.max(0, aiProperties.quota().resumeMatchFreePerMonth());
    }

    private ZonedDateTime nextPeriodStart() {
        return ZonedDateTime.now(VIETNAM)
                .toLocalDate()
                .withDayOfMonth(1)
                .plusMonths(1)
                .atStartOfDay(VIETNAM);
    }

    private String key(Long companyId) {
        return KEY_PREFIX + companyId + ":" + PERIOD.format(ZonedDateTime.now(VIETNAM));
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
