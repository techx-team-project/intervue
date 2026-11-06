package com.techx.intervue.modules.notification.services.interfaces;

import com.techx.intervue.modules.notification.enums.NotificationCategory;
import com.techx.intervue.modules.notification.enums.RecipientType;

public interface NotificationStateServiceInterface {

    void markRead(RecipientType recipientType, Long recipientId, Long recipientRowId);

    int markAllRead(RecipientType recipientType, Long recipientId, NotificationCategory category);

    int markAllSeen(RecipientType recipientType, Long recipientId);

    void archive(RecipientType recipientType, Long recipientId, Long recipientRowId);
}
