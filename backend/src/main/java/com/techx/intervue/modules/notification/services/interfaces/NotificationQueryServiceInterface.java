package com.techx.intervue.modules.notification.services.interfaces;

import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.requests.SearchNotificationRequest;
import com.techx.intervue.modules.notification.resources.NotificationDetailResource;
import com.techx.intervue.modules.notification.resources.NotificationListResource;
import com.techx.intervue.modules.notification.resources.UnreadCountResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationQueryServiceInterface {

    Page<NotificationListResource> search(
            RecipientType recipientType,
            Long recipientId,
            SearchNotificationRequest request,
            Pageable pageable);

    NotificationDetailResource getDetail(
            RecipientType recipientType, Long recipientId, Long recipientRowId);

    UnreadCountResource unreadCount(RecipientType recipientType, Long recipientId);
}
