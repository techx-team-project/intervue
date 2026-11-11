package com.techx.intervue.modules.billing.services.impl;

import com.techx.intervue.modules.billing.entities.Order;
import com.techx.intervue.modules.company.services.interfaces.CompanyServiceInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
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
    private final UserServiceInterface userService;

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

    public void refundApproved(Order order, long approvedAmount) {
        publishAll(
                companyService.findActiveMemberIds(order.getCompanyId()),
                order,
                NotificationType.REFUND_APPROVED,
                Map.of(
                        "orderCode", order.getCode(),
                        "approvedAmount", money(approvedAmount, order.getCurrency())));
    }

    public void refundRejected(Order order) {
        publishAll(
                companyService.findActiveMemberIds(order.getCompanyId()),
                order,
                NotificationType.REFUND_REJECTED,
                Map.of("orderCode", order.getCode()));
    }

    public void orderExpiredUnderpaid(Order order) {
        publishAll(
                companyService.findActiveMemberIds(order.getCompanyId()),
                order,
                NotificationType.ORDER_EXPIRED_UNDERPAID,
                Map.of(
                        "orderCode", order.getCode(),
                        "paidAmount", money(order.getPaidAmount(), order.getCurrency())));
    }

    public void orderExpiredNeedsManualRefund(Order order) {
        List<Long> adminIds = userService.findActiveIdsByRole(RoleType.ADMIN);
        if (adminIds.isEmpty()) {
            return;
        }
        Map<String, Object> params =
                Map.of(
                        "orderCode", order.getCode(),
                        "paidAmount", money(order.getPaidAmount(), order.getCurrency()));
        notificationPublisher.publishAll(
                adminIds.stream()
                        .map(
                                adminId ->
                                        NotificationCommand.builder()
                                                .recipientType(RecipientType.USER)
                                                .recipientId(adminId)
                                                .type(NotificationType.ORDER_EXPIRED_WITH_PAYMENT)
                                                .params(params)
                                                .actionUrl("/admin/finance/orders")
                                                .build())
                        .toList());
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
