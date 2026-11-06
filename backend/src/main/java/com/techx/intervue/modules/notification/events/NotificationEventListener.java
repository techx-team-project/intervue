package com.techx.intervue.modules.notification.events;

import com.techx.intervue.modules.company.enums.BusinessDocumentType;
import com.techx.intervue.modules.company.enums.PublishRightLossCause;
import com.techx.intervue.modules.company.events.BusinessDocumentReviewedEvent;
import com.techx.intervue.modules.company.events.PublishRightLostEvent;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import com.techx.intervue.modules.user.enums.AccountType;
import com.techx.intervue.modules.user.events.AccountRestrictedEvent;
import com.techx.intervue.modules.user.events.AccountRestrictionLiftedEvent;
import com.techx.intervue.modules.user.events.NewDeviceSignInEvent;
import com.techx.intervue.modules.user.events.SecuritySettingChangedEvent;
import com.techx.intervue.modules.user.events.UserRolesChangedEvent;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class NotificationEventListener {

    private static final ZoneId ZONE = ZoneId.of("Asia/Ho_Chi_Minh");
    private static final DateTimeFormatter DATE =
            DateTimeFormatter.ofPattern("dd/MM/yyyy").withZone(ZONE);
    private static final DateTimeFormatter DATE_TIME =
            DateTimeFormatter.ofPattern("HH:mm 'ngày' dd/MM/yyyy").withZone(ZONE);
    private static final String INDEFINITE = "không thời hạn";
    private static final String UNKNOWN = "không xác định";
    private static final String VERIFICATION_PATH = "/recruiter/company/verification";

    private final NotificationPublisherInterface notificationPublisher;

    @Async("notificationTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onBusinessDocumentReviewed(BusinessDocumentReviewedEvent event) {
        NotificationType type =
                switch (event.outcome()) {
                    case APPROVED -> NotificationType.BUSINESS_DOCUMENT_APPROVED;
                    case REJECTED -> NotificationType.BUSINESS_DOCUMENT_REJECTED;
                    case MORE_INFO_REQUIRED -> NotificationType.BUSINESS_DOCUMENT_MORE_INFO;
                    case REVOKED -> NotificationType.BUSINESS_DOCUMENT_REVOKED;
                    case EXPIRED -> NotificationType.BUSINESS_DOCUMENT_EXPIRED;
                    case PENDING_REVIEW -> null;
                };
        if (type == null) {
            return;
        }

        Map<String, Object> params = new HashMap<>();
        params.put("documentLabel", labelOf(event.documentType()));
        params.put("companyName", event.companyName());
        params.put("reason", blankToDash(event.reason()));
        params.put("expiresAt", formatDate(event.expiresAt()));

        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.RECRUITER)
                        .recipientId(event.recruiterId())
                        .type(type)
                        .params(params)
                        .actionUrl(VERIFICATION_PATH)
                        .build());
    }

    @Async("notificationTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onPublishRightLost(PublishRightLostEvent event) {
        if (event.userId() == null) {
            return;
        }

        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.RECRUITER)
                        .recipientId(event.userId())
                        .type(NotificationType.PUBLISH_RIGHT_LOST)
                        .params(
                                Map.of(
                                        "companyName", blankToDash(event.companyName()),
                                        "cause", causeOf(event.cause())))
                        .actionUrl(VERIFICATION_PATH)
                        .build());
    }

    @Async("notificationTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onAccountRestricted(AccountRestrictedEvent event) {
        Map<String, Object> params = new HashMap<>();
        params.put("reason", blankToDash(event.reason()));
        params.put(
                "expiresAt",
                event.expiresAt() == null ? INDEFINITE : formatDate(event.expiresAt()));

        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.USER)
                        .recipientId(event.userId())
                        .type(NotificationType.ACCOUNT_RESTRICTED)
                        .params(params)
                        .actionUrl("/account/security")
                        .build());
    }

    @Async("notificationTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onAccountRestrictionLifted(AccountRestrictionLiftedEvent event) {
        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.USER)
                        .recipientId(event.userId())
                        .type(NotificationType.ACCOUNT_RESTRICTION_LIFTED)
                        .params(Map.of())
                        .actionUrl("/")
                        .build());
    }

    @Async("notificationTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onUserRolesChanged(UserRolesChangedEvent event) {
        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.USER)
                        .recipientId(event.userId())
                        .type(NotificationType.ACCOUNT_ROLES_CHANGED)
                        .params(Map.of())
                        .actionUrl("/account")
                        .build());
    }

    @Async("notificationTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onNewDeviceSignIn(NewDeviceSignInEvent event) {
        boolean recruiter = event.accountType() == AccountType.RECRUITER;

        Map<String, Object> params = new HashMap<>();
        params.put("device", blankOr(event.deviceLabel(), UNKNOWN));
        params.put("location", blankOr(event.location(), UNKNOWN));
        params.put("ip", blankOr(event.ip(), UNKNOWN));
        params.put("at", DATE_TIME.format(event.at()));

        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(recruiter ? RecipientType.RECRUITER : RecipientType.USER)
                        .recipientId(event.accountId())
                        .type(NotificationType.SECURITY_NEW_DEVICE_LOGIN)
                        .params(params)
                        .actionUrl(recruiter ? "/recruiter/account/security" : "/account/security")
                        .build());
    }

    @Async("notificationTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT, fallbackExecution = true)
    public void onSecuritySettingChanged(SecuritySettingChangedEvent event) {
        boolean recruiter = event.accountType() == AccountType.RECRUITER;

        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(recruiter ? RecipientType.RECRUITER : RecipientType.USER)
                        .recipientId(event.accountId())
                        .type(NotificationType.SECURITY_SETTING_CHANGED)
                        .params(Map.of("change", event.change()))
                        .actionUrl(recruiter ? "/recruiter/account/security" : "/account/security")
                        .build());
    }

    private String labelOf(BusinessDocumentType documentType) {
        return switch (documentType) {
            case BUSINESS_LICENSE -> "Giấy phép kinh doanh";
            case LETTER_OF_AUTHORIZATION -> "Giấy uỷ quyền";
        };
    }

    private String causeOf(PublishRightLossCause cause) {
        return switch (cause) {
            case DOCUMENT_REVOKED -> "Tài liệu xác thực đã bị thu hồi";
            case DOCUMENT_EXPIRED -> "Tài liệu xác thực đã hết hạn";
            case MEMBERSHIP_REVOKED -> "Bạn đã bị gỡ khỏi danh sách thành viên của doanh nghiệp";
            case MEMBERSHIP_LEFT -> "Bạn đã rời khỏi doanh nghiệp";
        };
    }

    private String formatDate(Instant instant) {
        return instant == null ? INDEFINITE : DATE.format(instant);
    }

    private String blankToDash(String value) {
        return blankOr(value, "—");
    }

    private String blankOr(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
