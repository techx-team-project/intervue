package com.techx.intervue.modules.application.services.impl;

import com.techx.intervue.modules.application.enums.ApplicationStatus;
import com.techx.intervue.modules.application.repositories.ApplicationRepository;
import com.techx.intervue.modules.application.repositories.ApplicationRepository.JobCount;
import com.techx.intervue.modules.job.services.interfaces.JobLookupInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StaleApplicationReminderService {

    private static final int STALE_AFTER_DAYS = 7;

    private final ApplicationRepository applicationRepository;
    private final JobLookupInterface jobLookup;
    private final NotificationPublisherInterface notificationPublisher;

    @Scheduled(cron = "0 0 8 * * MON", zone = "Asia/Ho_Chi_Minh")
    @Transactional(readOnly = true)
    public void remindRecruiters() {
        Instant before = Instant.now().minus(Duration.ofDays(STALE_AFTER_DAYS));
        List<JobCount> stale =
                applicationRepository.countByJobForStatusSubmittedBefore(
                        ApplicationStatus.APPLIED, before);
        if (stale.isEmpty()) {
            return;
        }
        Map<Long, Long> recruiterByJob =
                jobLookup.findRecruiterIdsByJobIds(
                        stale.stream().map(JobCount::getJobId).collect(Collectors.toSet()));
        Map<Long, Long> waitingByRecruiter = new HashMap<>();
        stale.forEach(
                row -> {
                    Long recruiterId = recruiterByJob.get(row.getJobId());
                    if (recruiterId != null) {
                        waitingByRecruiter.merge(recruiterId, row.getTotal(), Long::sum);
                    }
                });
        notificationPublisher.publishAll(
                waitingByRecruiter.entrySet().stream()
                        .map(entry -> commandFor(entry.getKey(), entry.getValue()))
                        .toList());
    }

    private NotificationCommand commandFor(Long recruiterId, long waiting) {
        return NotificationCommand.builder()
                .recipientType(RecipientType.RECRUITER)
                .recipientId(recruiterId)
                .type(NotificationType.APPLICATIONS_WAITING_REVIEW)
                .params(Map.of("count", waiting, "days", STALE_AFTER_DAYS))
                .actionUrl("/recruiter/applications")
                .build();
    }
}
