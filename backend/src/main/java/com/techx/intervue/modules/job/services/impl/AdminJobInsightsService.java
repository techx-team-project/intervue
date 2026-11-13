package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.common.audit.entities.AuditLog;
import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.repositories.AuditLogRepository;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.resources.AdminJobInsightsResource;
import com.techx.intervue.modules.job.resources.AdminJobInsightsResource.DailyCount;
import com.techx.intervue.modules.job.resources.AdminJobInsightsResource.ReportedJob;
import com.techx.intervue.modules.job.services.interfaces.AdminJobInsightsServiceInterface;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.services.interfaces.ReportServiceInterface;
import com.techx.intervue.modules.moderation.services.interfaces.ReportServiceInterface.PendingTarget;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminJobInsightsService implements AdminJobInsightsServiceInterface {

    private static final Set<Integer> ALLOWED_WINDOWS = Set.of(7, 30, 90);
    private static final int MOST_REPORTED_LIMIT = 5;
    private static final Duration SUBMISSION_LOOKBACK = Duration.ofDays(30);
    private static final Set<AuditAction> REVIEW_ACTIONS =
            EnumSet.of(
                    AuditAction.JOB_SUBMITTED, AuditAction.JOB_APPROVED, AuditAction.JOB_REJECTED);

    private final JobRepository jobRepository;
    private final AuditLogRepository auditLogRepository;
    private final ReportServiceInterface reportService;

    @Override
    @Transactional(readOnly = true)
    public AdminJobInsightsResource insights(int days) {
        if (!ALLOWED_WINDOWS.contains(days)) {
            throw AppException.validation("days", "days must be 7, 30 or 90");
        }
        Instant since = Instant.now().minus(Duration.ofDays(days));
        ReviewFigures review = reviewFigures(since);
        long decided = review.approved() + review.rejected();
        return new AdminJobInsightsResource(
                days,
                jobRepository.countByStatus(JobStatus.PENDING_REVIEW),
                review.submitted(),
                review.approved(),
                review.rejected(),
                decided == 0 ? null : (double) review.approved() / decided,
                review.avgReviewHours(),
                publishedPerDay(since, days),
                mostReported());
    }

    private ReviewFigures reviewFigures(Instant since) {
        List<AuditLog> events =
                auditLogRepository.findByTargetTypeAndActionInSince(
                        AuditTargetType.JOB, REVIEW_ACTIONS, since.minus(SUBMISSION_LOOKBACK));
        Map<Long, Instant> submittedAt = new HashMap<>();
        long submitted = 0;
        long approved = 0;
        long rejected = 0;
        long reviewMillis = 0;
        long timed = 0;
        for (AuditLog event : events) {
            boolean inWindow = !event.getCreatedAt().isBefore(since);
            if (event.getAction() == AuditAction.JOB_SUBMITTED) {
                submittedAt.put(event.getTargetId(), event.getCreatedAt());
                submitted += inWindow ? 1 : 0;
                continue;
            }
            Instant submittedTime = submittedAt.remove(event.getTargetId());
            if (!inWindow) {
                continue;
            }
            if (event.getAction() == AuditAction.JOB_APPROVED) {
                approved++;
            } else {
                rejected++;
            }
            if (submittedTime != null) {
                reviewMillis += Duration.between(submittedTime, event.getCreatedAt()).toMillis();
                timed++;
            }
        }
        Double avgHours = timed == 0 ? null : reviewMillis / (double) timed / 3_600_000d;
        return new ReviewFigures(submitted, approved, rejected, avgHours);
    }

    private List<DailyCount> publishedPerDay(Instant since, int days) {
        Map<LocalDate, Long> perDay = new TreeMap<>();
        LocalDate today = JobDeadlines.today();
        for (int offset = days - 1; offset >= 0; offset--) {
            perDay.put(today.minusDays(offset), 0L);
        }
        for (Instant publishedAt : jobRepository.findPublishedAtSince(since)) {
            perDay.computeIfPresent(JobDeadlines.toBusinessDate(publishedAt), (day, n) -> n + 1);
        }
        return perDay.entrySet().stream()
                .map(entry -> new DailyCount(entry.getKey(), entry.getValue()))
                .toList();
    }

    private List<ReportedJob> mostReported() {
        List<PendingTarget> targets =
                reportService.mostReported(ReportTargetType.JOB_POST, MOST_REPORTED_LIMIT);
        Map<Long, Job> jobs =
                jobRepository
                        .findAllById(targets.stream().map(PendingTarget::targetId).toList())
                        .stream()
                        .collect(Collectors.toMap(Job::getId, Function.identity()));
        return targets.stream()
                .filter(target -> jobs.containsKey(target.targetId()))
                .map(
                        target -> {
                            Job job = jobs.get(target.targetId());
                            return new ReportedJob(
                                    job.getId(),
                                    job.getTitle(),
                                    job.getCompanyName(),
                                    target.pendingReports());
                        })
                .toList();
    }

    private record ReviewFigures(
            long submitted, long approved, long rejected, Double avgReviewHours) {}
}
