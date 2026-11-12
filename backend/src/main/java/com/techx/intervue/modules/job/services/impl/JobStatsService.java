package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.job.entities.JobDailyStat;
import com.techx.intervue.modules.job.repositories.JobDailyStatRepository;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.resources.JobStatsResource;
import com.techx.intervue.modules.job.resources.JobStatsResource.DailyStat;
import com.techx.intervue.modules.job.services.interfaces.JobApplicationLookupInterface;
import com.techx.intervue.modules.job.services.interfaces.JobStatsServiceInterface;
import com.techx.intervue.modules.job.services.interfaces.JobViewServiceInterface;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobStatsService implements JobStatsServiceInterface {

    private static final int MAX_DAYS = 90;
    private static final double PERCENT = 100.0;

    private final JobRepository jobRepository;
    private final JobDailyStatRepository statRepository;
    private final JobApplicationLookupInterface applicationLookup;
    private final JobViewServiceInterface viewService;

    @Override
    @Transactional(readOnly = true)
    public JobStatsResource stats(Long jobId, int days, Long recruiterId) {
        if (days < 1 || days > MAX_DAYS) {
            throw AppException.validation("days", "Choose between 1 and " + MAX_DAYS + " days");
        }
        jobRepository
                .findByIdAndRecruiterId(jobId, recruiterId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        LocalDate today = JobDeadlines.today();
        LocalDate from = today.minusDays(days - 1L);
        Map<LocalDate, Long> views =
                statRepository.findByJobIdAndStatDateGreaterThanEqual(jobId, from).stream()
                        .collect(
                                Collectors.toMap(
                                        JobDailyStat::getStatDate,
                                        stat -> stat.getViews().longValue()));
        views.merge(today, (long) viewService.pendingViews(jobId), Long::sum);
        Map<LocalDate, Long> applications = applicationsPerDay(jobId, from);

        List<DailyStat> daily = new ArrayList<>();
        for (LocalDate day = from; !day.isAfter(today); day = day.plusDays(1)) {
            daily.add(
                    new DailyStat(
                            day, views.getOrDefault(day, 0L), applications.getOrDefault(day, 0L)));
        }
        long totalViews = daily.stream().mapToLong(DailyStat::views).sum();
        long totalApplications = daily.stream().mapToLong(DailyStat::applications).sum();
        return JobStatsResource.builder()
                .totalViews(totalViews)
                .totalApplications(totalApplications)
                .conversionRate(totalViews == 0 ? null : totalApplications * PERCENT / totalViews)
                .daily(daily)
                .build();
    }

    private Map<LocalDate, Long> applicationsPerDay(Long jobId, LocalDate from) {
        Instant since = from.atStartOfDay(JobDeadlines.zone()).toInstant();
        return applicationLookup.submittedSince(jobId, since).stream()
                .map(JobDeadlines::toBusinessDate)
                .collect(
                        Collectors.groupingBy(
                                Function.identity(), HashMap::new, Collectors.counting()));
    }
}
