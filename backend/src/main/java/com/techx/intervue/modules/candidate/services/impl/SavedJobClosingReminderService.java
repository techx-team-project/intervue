package com.techx.intervue.modules.candidate.services.impl;

import com.techx.intervue.modules.candidate.repositories.SavedJobRepository;
import com.techx.intervue.modules.candidate.repositories.SavedJobRepository.CandidateCount;
import com.techx.intervue.modules.job.services.interfaces.JobLookupInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SavedJobClosingReminderService {

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final int DAYS_AHEAD = 2;
    private static final int CHUNK_SIZE = 500;

    private final SavedJobRepository savedJobRepository;
    private final JobLookupInterface jobLookup;
    private final NotificationPublisherInterface notificationPublisher;

    @Scheduled(cron = "0 0 8 * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional(readOnly = true)
    public void remindCandidates() {
        List<Long> closingJobIds =
                jobLookup.findOpenJobIdsClosingOn(
                        LocalDate.now(BUSINESS_ZONE).plusDays(DAYS_AHEAD));
        Map<Long, Long> closingByCandidate = new HashMap<>();
        for (int from = 0; from < closingJobIds.size(); from += CHUNK_SIZE) {
            List<Long> chunk =
                    closingJobIds.subList(from, Math.min(from + CHUNK_SIZE, closingJobIds.size()));
            for (CandidateCount row : savedJobRepository.countByCandidateForJobs(chunk)) {
                closingByCandidate.merge(row.getCandidateId(), row.getTotal(), Long::sum);
            }
        }
        notificationPublisher.publishAll(
                closingByCandidate.entrySet().stream()
                        .map(entry -> commandFor(entry.getKey(), entry.getValue()))
                        .toList());
    }

    private NotificationCommand commandFor(Long candidateId, long closing) {
        return NotificationCommand.builder()
                .recipientType(RecipientType.USER)
                .recipientId(candidateId)
                .type(NotificationType.SAVED_JOBS_CLOSING_SOON)
                .params(Map.of("count", closing, "days", DAYS_AHEAD))
                .actionUrl("/candidate/saved-jobs")
                .build();
    }
}
