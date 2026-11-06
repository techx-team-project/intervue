package com.techx.intervue.modules.notification.services.impl;

import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationUnreadCacheInterface;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationUnreadCache implements NotificationUnreadCacheInterface {

    private static final String KEY_PREFIX = "notif:unread:";
    private static final Duration TTL = Duration.ofMinutes(5);

    private final RedisTemplate<String, String> redis;

    @Override
    public Long get(RecipientType recipientType, Long recipientId) {
        String raw = redis.opsForValue().get(key(recipientType, recipientId));
        if (raw == null) {
            return null;
        }
        try {
            return Long.valueOf(raw);
        } catch (NumberFormatException e) {
            log.warn("Discarding malformed unread counter for {}:{}", recipientType, recipientId);
            evict(recipientType, recipientId);
            return null;
        }
    }

    @Override
    public void set(RecipientType recipientType, Long recipientId, long total) {
        redis.opsForValue().set(key(recipientType, recipientId), Long.toString(total), TTL);
    }

    @Override
    public void evict(RecipientType recipientType, Long recipientId) {
        redis.delete(key(recipientType, recipientId));
    }

    private String key(RecipientType recipientType, Long recipientId) {
        return KEY_PREFIX + recipientType.name() + ":" + recipientId;
    }
}
