package com.techx.intervue.modules.job.events;

import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JobReviewQueueNotifier {

    private static final String QUEUE_LABEL = "Job posts";
    private static final String QUEUE_PATH = "/admin/moderation/job-posts";

    private final UserServiceInterface userService;
    private final NotificationPublisherInterface notificationPublisher;

    @EventListener
    public void onSubmitted(JobSubmittedForReviewEvent event) {
        List<NotificationCommand> commands =
                userService.findActiveIdsByRole(RoleType.ADMIN).stream()
                        .map(
                                adminId ->
                                        NotificationCommand.builder()
                                                .recipientType(RecipientType.USER)
                                                .recipientId(adminId)
                                                .type(NotificationType.ADMIN_REVIEW_QUEUE_ITEM)
                                                .params(
                                                        Map.of(
                                                                "companyName",
                                                                event.companyName(),
                                                                "queueLabel",
                                                                QUEUE_LABEL))
                                                .actionUrl(QUEUE_PATH)
                                                .build())
                        .toList();
        notificationPublisher.publishAll(commands);
    }
}
