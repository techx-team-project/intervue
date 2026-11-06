package com.techx.intervue.modules.notification.services.impl;

import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.notification.entities.NotificationRecipient;
import com.techx.intervue.modules.notification.enums.NotificationCategory;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.repositories.NotificationRecipientRepository;
import com.techx.intervue.modules.notification.services.interfaces.NotificationStateServiceInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationUnreadCacheInterface;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationStateService implements NotificationStateServiceInterface {

    private final NotificationRecipientRepository recipientRepository;
    private final NotificationUnreadCacheInterface unreadCache;

    @Override
    @Transactional
    public void markRead(RecipientType recipientType, Long recipientId, Long recipientRowId) {
        NotificationRecipient recipient = require(recipientType, recipientId, recipientRowId);
        if (recipient.getReadAt() == null) {
            Instant now = Instant.now();
            recipient.setReadAt(now);
            if (recipient.getSeenAt() == null) {
                recipient.setSeenAt(now);
            }
            unreadCache.evict(recipientType, recipientId);
        }
    }

    @Override
    @Transactional
    public int markAllRead(
            RecipientType recipientType, Long recipientId, NotificationCategory category) {
        Instant now = Instant.now();
        int updated =
                category == null
                        ? recipientRepository.markAllRead(recipientType, recipientId, now)
                        : recipientRepository.markAllReadInCategory(
                                recipientType, recipientId, category, now);
        unreadCache.evict(recipientType, recipientId);
        return updated;
    }

    @Override
    @Transactional
    public int markAllSeen(RecipientType recipientType, Long recipientId) {
        return recipientRepository.markAllSeen(recipientType, recipientId, Instant.now());
    }

    @Override
    @Transactional
    public void archive(RecipientType recipientType, Long recipientId, Long recipientRowId) {
        NotificationRecipient recipient = require(recipientType, recipientId, recipientRowId);
        if (recipient.getArchivedAt() == null) {
            recipient.setArchivedAt(Instant.now());
            unreadCache.evict(recipientType, recipientId);
        }
    }

    private NotificationRecipient require(
            RecipientType recipientType, Long recipientId, Long recipientRowId) {
        return recipientRepository
                .findByIdAndRecipientTypeAndRecipientId(recipientRowId, recipientType, recipientId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }
}
