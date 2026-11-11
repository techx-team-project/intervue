package com.techx.intervue.modules.ads.services.impl;

import com.techx.intervue.modules.ads.entities.AdMetric;
import com.techx.intervue.modules.ads.repositories.AdMetricRepository;
import java.time.LocalDate;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/** Moves the Redis counters into the daily table so a page view never touches the database. */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdMetricFlushScheduler {

    private final StringRedisTemplate redis;
    private final AdMetricRepository metricRepository;

    @Scheduled(cron = "0 */5 * * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void flush() {
        LocalDate today = AdWeeks.today();
        int moved =
                drain(AdServingService.IMPRESSION_KEY, today, true)
                        + drain(AdServingService.CLICK_KEY, today, false);
        if (moved > 0) {
            log.info("Flushed ad counters for {} booking(s)", moved);
        }
    }

    private int drain(String prefix, LocalDate day, boolean impressions) {
        Set<String> keys = redis.keys(prefix + "*");
        if (keys == null || keys.isEmpty()) {
            return 0;
        }
        int moved = 0;
        for (String key : keys) {
            String raw = redis.opsForValue().getAndDelete(key);
            if (raw == null || raw.isBlank()) {
                continue;
            }
            Long bookingId = parseBookingId(key, prefix);
            if (bookingId == null) {
                continue;
            }
            int amount = Integer.parseInt(raw);
            AdMetric metric =
                    metricRepository
                            .findByAdBookingIdAndMetricDate(bookingId, day)
                            .orElseGet(
                                    () ->
                                            AdMetric.builder()
                                                    .adBookingId(bookingId)
                                                    .metricDate(day)
                                                    .impressions(0)
                                                    .clicks(0)
                                                    .build());
            if (impressions) {
                metric.setImpressions(metric.getImpressions() + amount);
            } else {
                metric.setClicks(metric.getClicks() + amount);
            }
            metricRepository.save(metric);
            moved++;
        }
        return moved;
    }

    private Long parseBookingId(String key, String prefix) {
        try {
            return Long.parseLong(key.substring(prefix.length()));
        } catch (NumberFormatException malformed) {
            log.warn("Skipping ad counter key {}", key);
            return null;
        }
    }
}
