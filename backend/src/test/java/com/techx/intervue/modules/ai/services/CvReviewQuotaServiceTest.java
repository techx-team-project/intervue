package com.techx.intervue.modules.ai.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.techx.intervue.common.policy.FreeQuotaPolicyInterface;
import com.techx.intervue.common.policy.FreeQuotaValues;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.ai.resources.CvReviewQuotaResource;
import com.techx.intervue.modules.ai.services.impl.CvReviewQuotaService;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

class CvReviewQuotaServiceTest {

    private StringRedisTemplate redis;
    private ValueOperations<String, String> valueOperations;
    private FreeQuotaPolicyInterface freeQuotaPolicy;
    private CvReviewQuotaService quotaService;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() {
        redis = mock(StringRedisTemplate.class);
        valueOperations = mock(ValueOperations.class);
        freeQuotaPolicy = mock(FreeQuotaPolicyInterface.class);
        when(freeQuotaPolicy.current()).thenReturn(FreeQuotaValues.DEFAULTS);
        when(redis.opsForValue()).thenReturn(valueOperations);
        quotaService = new CvReviewQuotaService(redis, freeQuotaPolicy);
    }

    @Test
    void getQuota_calculatesRemainingAndResetAtMidnightVietnamTime() {
        Long candidateUserId = 100L;
        when(valueOperations.get(anyString())).thenReturn("1");

        CvReviewQuotaResource quota = quotaService.getQuota(candidateUserId);

        assertThat(quota.usedToday()).isEqualTo(1);
        assertThat(quota.remaining()).isEqualTo(2);
        assertThat(quota.maxDaily()).isEqualTo(3);

        ZonedDateTime nowVietnam = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        ZonedDateTime expectedMidnight =
                nowVietnam.toLocalDate().plusDays(1).atStartOfDay(ZoneId.of("Asia/Ho_Chi_Minh"));
        assertThat(quota.resetAt()).isEqualTo(expectedMidnight.toInstant());
    }

    @Test
    void checkAndConsumeQuota_allowsUpToThreeUses() {
        Long candidateUserId = 100L;
        when(valueOperations.increment(anyString())).thenReturn(1L);

        quotaService.checkAndConsumeQuota(candidateUserId);

        verify(redis).expire(anyString(), any(Duration.class));
    }

    @Test
    void checkAndConsumeQuota_throwsWhenExceedingThreeUses() {
        Long candidateUserId = 100L;
        when(valueOperations.increment(anyString())).thenReturn(4L);

        assertThatThrownBy(() -> quotaService.checkAndConsumeQuota(candidateUserId))
                .isInstanceOf(AppException.class)
                .hasFieldOrPropertyWithValue("errorCode", ErrorCode.AI_USER_QUOTA_EXCEEDED);

        verify(valueOperations).decrement(anyString());
    }

    @Test
    void releaseQuota_decrementsKey() {
        Long candidateUserId = 100L;
        when(valueOperations.decrement(anyString())).thenReturn(1L);

        quotaService.releaseQuota(candidateUserId);

        verify(valueOperations).decrement(anyString());
    }
}
