package com.techx.intervue.modules.notification.services.impl;

import com.techx.intervue.modules.notification.entities.Notification;
import com.techx.intervue.modules.notification.enums.BroadcastStatus;
import com.techx.intervue.modules.notification.enums.NotificationKind;
import com.techx.intervue.modules.notification.repositories.NotificationRecipientRepository;
import com.techx.intervue.modules.notification.repositories.NotificationRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationRetentionJob {

    private static final int READ_RETENTION_DAYS = 90;
    private static final int ARCHIVED_RETENTION_DAYS = 30;
    private static final int ABANDONED_DRAFT_DAYS = 180;

    private final NotificationRecipientRepository recipientRepository;
    private final NotificationRepository notificationRepository;

    @Transactional
    @Scheduled(cron = "0 30 2 * * *")
    public void purgeStaleNotifications() {
        Instant now = Instant.now();

        int read =
                recipientRepository.deleteByReadAtIsNotNullAndReadAtLessThan(
                        now.minus(READ_RETENTION_DAYS, ChronoUnit.DAYS));
        int archived =
                recipientRepository.deleteByArchivedAtIsNotNullAndArchivedAtLessThan(
                        now.minus(ARCHIVED_RETENTION_DAYS, ChronoUnit.DAYS));

        List<Notification> abandonedDrafts =
                notificationRepository.findByKindAndStatusAndCreatedAtLessThan(
                        NotificationKind.BROADCAST,
                        BroadcastStatus.DRAFT,
                        now.minus(ABANDONED_DRAFT_DAYS, ChronoUnit.DAYS));
        notificationRepository.deleteAll(abandonedDrafts);

        log.info(
                "Notification retention: purged {} read, {} archived, {} abandoned drafts",
                read,
                archived,
                abandonedDrafts.size());
    }
}
