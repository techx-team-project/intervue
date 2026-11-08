package com.techx.intervue.modules.candidate.events;

import com.techx.intervue.modules.candidate.repositories.CompanyFollowRepository;
import com.techx.intervue.modules.job.events.JobPublishedEvent;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class FollowedCompanyJobListener {

    private static final int BATCH_SIZE = 500;
    private static final String JOB_PATH = "/jobs/";

    private final CompanyFollowRepository followRepository;
    private final NotificationPublisherInterface notificationPublisher;

    @Async("notificationTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onJobPublished(JobPublishedEvent event) {
        int pageNumber = 0;
        Page<Long> followers;
        do {
            followers =
                    followRepository.findCandidateIdsByCompanyId(
                            event.companyId(), PageRequest.of(pageNumber++, BATCH_SIZE));
            List<NotificationCommand> commands =
                    followers.getContent().stream()
                            .map(candidateId -> commandFor(candidateId, event))
                            .toList();
            notificationPublisher.publishAll(commands);
        } while (followers.hasNext());
    }

    private NotificationCommand commandFor(Long candidateId, JobPublishedEvent event) {
        return NotificationCommand.builder()
                .recipientType(RecipientType.USER)
                .recipientId(candidateId)
                .type(NotificationType.FOLLOWED_COMPANY_NEW_JOB)
                .params(Map.of("jobTitle", event.jobTitle(), "companyName", event.companyName()))
                .actionUrl(JOB_PATH + event.jobId())
                .build();
    }
}
