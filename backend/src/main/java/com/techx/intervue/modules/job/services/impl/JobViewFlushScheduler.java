package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.modules.job.repositories.JobDailyStatRepository;
import java.time.LocalDate;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/** Moves the Redis view counters into the daily table so a page view never touches the database. */
@Slf4j
@Component
@RequiredArgsConstructor
public class JobViewFlushScheduler {

    private final StringRedisTemplate redis;
    private final JobDailyStatRepository statRepository;

    @Scheduled(cron = "0 */5 * * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void flush() {
        Set<String> keys = redis.keys(JobViewService.VIEW_KEY + "*");
        if (keys == null || keys.isEmpty()) {
            return;
        }
        LocalDate today = JobDeadlines.today();
        int moved = 0;
        for (String key : keys) {
            String raw = redis.opsForValue().getAndDelete(key);
            Long jobId = parseJobId(key);
            if (raw == null || raw.isBlank() || jobId == null) {
                continue;
            }
            statRepository.addViews(jobId, today, Integer.parseInt(raw));
            moved++;
        }
        if (moved > 0) {
            log.info("Flushed view counters for {} job(s)", moved);
        }
    }

    private Long parseJobId(String key) {
        try {
            return Long.parseLong(key.substring(JobViewService.VIEW_KEY.length()));
        } catch (NumberFormatException malformed) {
            log.warn("Skipping job view key {}", key);
            return null;
        }
    }
}
