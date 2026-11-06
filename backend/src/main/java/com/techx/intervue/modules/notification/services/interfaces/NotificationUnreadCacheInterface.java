package com.techx.intervue.modules.notification.services.interfaces;

import com.techx.intervue.modules.notification.enums.RecipientType;

public interface NotificationUnreadCacheInterface {

    Long get(RecipientType recipientType, Long recipientId);

    void set(RecipientType recipientType, Long recipientId, long total);

    void evict(RecipientType recipientType, Long recipientId);
}
