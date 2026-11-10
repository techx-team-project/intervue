package com.techx.intervue.modules.ads.services.impl;

import com.techx.intervue.modules.ads.entities.AdBooking;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdsNotifier {

    private static final String ADS_PATH = "/recruiter/ads";

    private final NotificationPublisherInterface notificationPublisher;
    private final CompanyServiceInterface companyService;

    public void creativeApproved(AdBooking booking) {
        publishAll(
                booking,
                NotificationType.AD_CREATIVE_APPROVED,
                Map.of("weekStart", booking.getWeekStart().toString()));
    }

    public void creativeRejected(AdBooking booking, String reason) {
        publishAll(
                booking,
                NotificationType.AD_CREATIVE_REJECTED,
                Map.of(
                        "weekStart",
                        booking.getWeekStart().toString(),
                        "reason",
                        reason == null ? "" : reason));
    }

    public void weekStartingSoonNoCreative(AdBooking booking) {
        publishAll(
                booking,
                NotificationType.AD_WEEK_STARTING_SOON_NO_CREATIVE,
                Map.of("weekStart", booking.getWeekStart().toString()));
    }

    private void publishAll(AdBooking booking, NotificationType type, Map<String, Object> params) {
        List<Long> recipientIds = companyService.findActiveMemberIds(booking.getCompanyId());
        if (recipientIds.isEmpty()) {
            return;
        }
        notificationPublisher.publishAll(
                recipientIds.stream()
                        .map(
                                recipientId ->
                                        NotificationCommand.builder()
                                                .recipientType(RecipientType.RECRUITER)
                                                .recipientId(recipientId)
                                                .type(type)
                                                .params(params)
                                                .actionUrl(ADS_PATH)
                                                .build())
                        .toList());
    }
}
