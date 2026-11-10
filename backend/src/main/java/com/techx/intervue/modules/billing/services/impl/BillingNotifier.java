package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import java.text.NumberFormat;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BillingNotifier {

    private static final ZoneId VIETNAM = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter MOMENT =
            DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy").withZone(VIETNAM);

    private final NotificationPublisherInterface notificationPublisher;
    private final CompanyServiceInterface companyService;

    public void orderCreated(Order order, String buyerName) {
        publishAll(
                companyService.findActiveMemberIds(order.getCompanyId()),
                order,
                NotificationType.ORDER_CREATED,
                Map.of(
                        "orderCode", order.getCode(),
                        "buyerName", buyerName,
                        "totalAmount", money(order.getTotalAmount(), order.getCurrency()),
                        "expiresAt", MOMENT.format(order.getExpiresAt())));
    }

    public void orderPaid(Order order) {
        publishAll(
                companyService.findActiveMemberIds(order.getCompanyId()),
                order,
                NotificationType.ORDER_PAID,
                Map.of(
                        "orderCode", order.getCode(),
                        "paidAmount", money(order.getPaidAmount(), order.getCurrency())));
    }

    public void orderUnderpaid(Order order) {
        long missing = Math.max(0, order.getTotalAmount() - order.getPaidAmount());
        publishAll(
                List.of(order.getPurchasedByRecruiterId()),
                order,
                NotificationType.ORDER_UNDERPAID,
                Map.of(
                        "orderCode", order.getCode(),
                        "paidAmount", money(order.getPaidAmount(), order.getCurrency()),
                        "totalAmount", money(order.getTotalAmount(), order.getCurrency()),
                        "missingAmount", money(missing, order.getCurrency()),
                        "expiresAt", MOMENT.format(order.getExpiresAt())));
    }

    private void publishAll(
            List<Long> recipientIds,
            Order order,
            NotificationType type,
            Map<String, Object> params) {
        if (recipientIds.isEmpty()) {
            return;
        }
        String actionUrl = "/recruiter/orders/" + order.getCode();
        notificationPublisher.publishAll(
                recipientIds.stream()
                        .map(
                                recipientId ->
                                        NotificationCommand.builder()
                                                .recipientType(RecipientType.RECRUITER)
                                                .recipientId(recipientId)
                                                .type(type)
                                                .params(params)
                                                .actionUrl(actionUrl)
                                                .build())
                        .toList());
    }

    private String money(long amount, String currency) {
        return NumberFormat.getInstance(Locale.US).format(amount) + " " + currency;
    }
}
