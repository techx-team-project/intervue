package com.techx.intervue.modules.job.events;

import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JobAdminQueueNotifier {

    private static final String QUEUE_LABEL = "Job posts";
    private static final String REVIEW_QUEUE_PATH = "/admin/moderation/job-posts";
    private static final String REPORTS_PATH = "/admin/moderation/reports";

    private final UserServiceInterface userService;
    private final NotificationPublisherInterface notificationPublisher;

    @EventListener
    public void onSubmitted(JobSubmittedForReviewEvent event) {
        notifyAdmins(
                NotificationType.ADMIN_REVIEW_QUEUE_ITEM,
                Map.of("companyName", event.companyName(), "queueLabel", QUEUE_LABEL),
                REVIEW_QUEUE_PATH);
    }

    @EventListener
    public void onReportThresholdReached(JobReportThresholdReachedEvent event) {
        notifyAdmins(
                NotificationType.JOB_REPORT_THRESHOLD_REACHED,
                Map.of("jobTitle", event.jobTitle(), "count", event.pendingReports()),
                REPORTS_PATH);
    }

    private void notifyAdmins(NotificationType type, Map<String, Object> params, String actionUrl) {
        notificationPublisher.publishAll(
                userService.findActiveIdsByRole(RoleType.ADMIN).stream()
                        .map(
                                adminId ->
                                        NotificationCommand.builder()
                                                .recipientType(RecipientType.USER)
                                                .recipientId(adminId)
                                                .type(type)
                                                .params(params)
                                                .actionUrl(actionUrl)
                                                .build())
                        .toList());
    }
}
