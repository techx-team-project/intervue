package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobExpiryReminderService {

    private static final int DAYS_AHEAD = 3;
    private static final String EXTEND_PATH = "/recruiter/jobs?extend=";

    private final JobRepository jobRepository;
    private final NotificationPublisherInterface notificationPublisher;

    @Scheduled(cron = "0 0 8 * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional(readOnly = true)
    public void remindRecruiters() {
        notificationPublisher.publishAll(
                jobRepository
                        .findByStatusAndDeadline(
                                JobStatus.PUBLISHED, JobDeadlines.today().plusDays(DAYS_AHEAD))
                        .stream()
                        .map(
                                job ->
                                        NotificationCommand.builder()
                                                .recipientType(RecipientType.RECRUITER)
                                                .recipientId(job.getRecruiterId())
                                                .type(NotificationType.JOB_EXPIRING_SOON)
                                                .params(
                                                        Map.of(
                                                                "jobTitle",
                                                                job.getTitle(),
                                                                "days",
                                                                DAYS_AHEAD))
                                                .actionUrl(EXTEND_PATH + job.getId())
                                                .build())
                        .toList());
    }
}
