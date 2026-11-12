package com.techx.intervue.common.seed.steps;

import com.techx.intervue.common.seed.DemoSeedData;
import com.techx.intervue.common.seed.DemoSeedStep;
import com.techx.intervue.common.seed.SeedDatabase;
import com.techx.intervue.common.seed.SeedLookups;
import com.techx.intervue.common.seed.SeedLookups.SeedJob;
import com.techx.intervue.common.seed.SeedRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile("local")
@Order(7)
@RequiredArgsConstructor
public class JobStatsSeedStep implements DemoSeedStep {

    private static final List<String> STAT_COLUMNS =
            List.of("job_id", "stat_date", "views", "created_at", "updated_at");
    private static final int DAYS = 30;
    private static final int MIN_DAILY_VIEWS = 1;
    private static final int BASE_DAILY_VIEWS = 6;
    private static final int VIEWS_PER_APPLICATION = 3;

    private final SeedDatabase database;
    private final SeedLookups lookups;

    @Override
    public void seed() {
        if (!database.allEmpty("job_daily_stats")) {
            return;
        }
        List<SeedJob> jobs =
                lookups.jobsWithStatus(List.of("PUBLISHED", "PAUSED", "CLOSED", "EXPIRED"));
        if (jobs.isEmpty()) {
            return;
        }
        SeedRandom random = new SeedRandom(DemoSeedData.RANDOM_SEED + 7);
        Map<Long, Integer> applications = applicationCounts();
        LocalDateTime now = random.now();
        LocalDate today = now.toLocalDate();
        List<Object[]> rows = new ArrayList<>();
        for (SeedJob job : jobs) {
            int ceiling =
                    BASE_DAILY_VIEWS
                            + applications.getOrDefault(job.id(), 0) * VIEWS_PER_APPLICATION;
            for (int offset = 0; offset < DAYS; offset++) {
                rows.add(
                        new Object[] {
                            job.id(),
                            today.minusDays(offset),
                            random.between(MIN_DAILY_VIEWS, ceiling),
                            now,
                            now
                        });
            }
        }
        database.insert("job_daily_stats", STAT_COLUMNS, rows);
        log.info("Seeded {} daily view rows for {} jobs", rows.size(), jobs.size());
    }

    private Map<Long, Integer> applicationCounts() {
        Map<Long, Integer> counts = new HashMap<>();
        database.jdbc()
                .query(
                        "SELECT job_id, COUNT(*) AS total FROM applications"
                                + " WHERE status <> 'DRAFT' GROUP BY job_id",
                        rs -> {
                            counts.put(rs.getLong("job_id"), rs.getInt("total"));
                        });
        return counts;
    }
}
