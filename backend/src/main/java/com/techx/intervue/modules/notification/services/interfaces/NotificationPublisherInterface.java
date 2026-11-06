package com.techx.intervue.modules.notification.services.interfaces;

import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import java.util.List;
import java.util.Map;
import lombok.Builder;

public interface NotificationPublisherInterface {

    @Builder
    record NotificationCommand(
            RecipientType recipientType,
            Long recipientId,
            NotificationType type,
            Map<String, Object> params,
            String actionUrl) {}

    void publish(NotificationCommand command);

    void publishAll(List<NotificationCommand> commands);
}
