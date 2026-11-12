package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.services.interfaces.JobViewServiceInterface;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class JobViewService implements JobViewServiceInterface {

    static final String VIEW_KEY = "job:views:";
    private static final String VIEW_GUARD_KEY = "job:view-guard:";
    private static final Duration VIEW_COOLDOWN = Duration.ofMinutes(30);
    private static final Duration COUNTER_TTL = Duration.ofDays(2);

    private final JobRepository jobRepository;
    private final StringRedisTemplate redis;

    @Override
    @Transactional(readOnly = true)
    public void record(Long jobId, String clientIp) {
        if (!jobRepository.existsByIdAndStatusAndDeadlineGreaterThanEqual(
                jobId, JobStatus.PUBLISHED, JobDeadlines.today())) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        try {
            // One view per IP per job per half hour keeps a refresh loop from inflating the report
            if (!Boolean.TRUE.equals(
                    redis.opsForValue()
                            .setIfAbsent(
                                    VIEW_GUARD_KEY + jobId + ":" + clientIp, "1", VIEW_COOLDOWN))) {
                return;
            }
            Long value = redis.opsForValue().increment(VIEW_KEY + jobId);
            if (value != null && value == 1L) {
                redis.expire(VIEW_KEY + jobId, COUNTER_TTL);
            }
        } catch (RuntimeException ex) {
            log.warn("Failed to count a view of job {}", jobId, ex);
        }
    }

    @Override
    public int pendingViews(Long jobId) {
        try {
            String raw = redis.opsForValue().get(VIEW_KEY + jobId);
            return raw == null || raw.isBlank() ? 0 : Integer.parseInt(raw);
        } catch (RuntimeException ex) {
            log.warn("Failed to read the pending views of job {}", jobId, ex);
            return 0;
        }
    }
}
