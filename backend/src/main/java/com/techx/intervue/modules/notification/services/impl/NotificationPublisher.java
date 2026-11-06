package com.techx.intervue.modules.notification.services.impl;

import com.techx.intervue.modules.notification.entities.Notification;
import com.techx.intervue.modules.notification.entities.NotificationRecipient;
import com.techx.intervue.modules.notification.enums.NotificationKind;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.repositories.NotificationPreferenceRepository;
import com.techx.intervue.modules.notification.repositories.NotificationRecipientRepository;
import com.techx.intervue.modules.notification.repositories.NotificationRepository;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationUnreadCacheInterface;
import com.techx.intervue.modules.notification.templates.NotificationTemplate;
import com.techx.intervue.modules.notification.templates.NotificationTemplateRegistry;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationPublisher implements NotificationPublisherInterface {

    private final NotificationRepository notificationRepository;
    private final NotificationRecipientRepository recipientRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final NotificationTemplateRegistry templateRegistry;
    private final NotificationUnreadCacheInterface unreadCache;

    @Override
    @Transactional
    public void publish(NotificationCommand command) {
        publishAll(List.of(command));
    }

    @Override
    @Transactional
    public void publishAll(List<NotificationCommand> commands) {
        for (NotificationCommand command : commands) {
            if (isMuted(command)) {
                continue;
            }
            deliver(command);
        }
    }

    private void deliver(NotificationCommand command) {
        NotificationType type = command.type();
        NotificationTemplate rendered = templateRegistry.render(type, command.params());
        String actionUrl = command.actionUrl() != null ? command.actionUrl() : rendered.actionUrl();

        Notification notification =
                notificationRepository.save(
                        Notification.builder()
                                .kind(NotificationKind.EVENT)
                                .type(type)
                                .category(type.getCategory())
                                .severity(type.getSeverity())
                                .title(rendered.title())
                                .summary(rendered.summary())
                                .bodyMarkdown(rendered.body())
                                .actionUrl(actionUrl)
                                .actionLabel(actionUrl == null ? null : rendered.actionLabel())
                                .build());

        recipientRepository.save(
                NotificationRecipient.builder()
                        .notification(notification)
                        .recipientType(command.recipientType())
                        .recipientId(command.recipientId())
                        .build());

        unreadCache.evict(command.recipientType(), command.recipientId());
    }

    private boolean isMuted(NotificationCommand command) {
        if (command.type().isMandatory()) {
            return false;
        }
        RecipientType recipientType = command.recipientType();
        return preferenceRepository
                .findByRecipientTypeAndRecipientIdAndCategory(
                        recipientType, command.recipientId(), command.type().getCategory())
                .filter(preference -> !preference.isInApp())
                .isPresent();
    }
}
