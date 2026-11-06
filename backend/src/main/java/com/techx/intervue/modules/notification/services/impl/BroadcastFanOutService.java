package com.techx.intervue.modules.notification.services.impl;

import com.techx.intervue.modules.notification.enums.BroadcastAudience;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationUnreadCacheInterface;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class BroadcastFanOutService {

    private static final int CHUNK_SIZE = 500;

    private final BroadcastWriter writer;
    private final NotificationUnreadCacheInterface unreadCache;

    @Async("notificationTaskExecutor")
    public void deliver(Long broadcastId, BroadcastAudience audience, List<Long> recipientIds) {
        RecipientType recipientType = audience.recipientType();
        List<Long> targets = writer.withoutOptedOut(recipientType, recipientIds);

        for (int from = 0; from < targets.size(); from += CHUNK_SIZE) {
            writer.persistChunk(
                    broadcastId,
                    recipientType,
                    targets.subList(from, Math.min(from + CHUNK_SIZE, targets.size())));
        }

        writer.markSent(broadcastId);
        targets.forEach(id -> unreadCache.evict(recipientType, id));
        log.info("Broadcast {} delivered to {} recipients", broadcastId, targets.size());
    }
}
