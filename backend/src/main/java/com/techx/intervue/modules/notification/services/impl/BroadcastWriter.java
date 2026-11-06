package com.techx.intervue.modules.notification.services.impl;

import com.techx.intervue.modules.notification.entities.Notification;
import com.techx.intervue.modules.notification.entities.NotificationRecipient;
import com.techx.intervue.modules.notification.enums.BroadcastStatus;
import com.techx.intervue.modules.notification.enums.NotificationCategory;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.repositories.NotificationPreferenceRepository;
import com.techx.intervue.modules.notification.repositories.NotificationRecipientRepository;
import com.techx.intervue.modules.notification.repositories.NotificationRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Kept apart from BroadcastFanOutService so each chunk really runs through the transaction proxy.
@Service
@RequiredArgsConstructor
public class BroadcastWriter {

    private final NotificationRepository notificationRepository;
    private final NotificationRecipientRepository recipientRepository;
    private final NotificationPreferenceRepository preferenceRepository;

    @Transactional(readOnly = true)
    public List<Long> withoutOptedOut(RecipientType recipientType, List<Long> recipientIds) {
        Set<Long> optedOut =
                preferenceRepository
                        .findByRecipientTypeAndRecipientIdInAndCategoryAndInAppFalse(
                                recipientType, recipientIds, NotificationCategory.SYSTEM)
                        .stream()
                        .map(preference -> preference.getRecipientId())
                        .collect(Collectors.toSet());
        return recipientIds.stream().filter(id -> !optedOut.contains(id)).toList();
    }

    @Transactional
    public void persistChunk(Long broadcastId, RecipientType recipientType, List<Long> chunk) {
        Notification broadcast = notificationRepository.getReferenceById(broadcastId);
        List<NotificationRecipient> rows = new ArrayList<>(chunk.size());
        for (Long recipientId : chunk) {
            rows.add(
                    NotificationRecipient.builder()
                            .notification(broadcast)
                            .recipientType(recipientType)
                            .recipientId(recipientId)
                            .build());
        }
        recipientRepository.saveAll(rows);
    }

    @Transactional
    public void markSent(Long broadcastId) {
        notificationRepository
                .findById(broadcastId)
                .ifPresent(
                        broadcast -> {
                            broadcast.setStatus(BroadcastStatus.SENT);
                            broadcast.setSentAt(Instant.now());
                        });
    }
}
