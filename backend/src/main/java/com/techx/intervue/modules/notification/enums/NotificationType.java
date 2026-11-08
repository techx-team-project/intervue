package com.techx.intervue.modules.notification.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum NotificationType {
    BUSINESS_DOCUMENT_APPROVED(NotificationCategory.COMPANY, NotificationSeverity.SUCCESS, true),
    BUSINESS_DOCUMENT_REJECTED(NotificationCategory.COMPANY, NotificationSeverity.DANGER, true),
    BUSINESS_DOCUMENT_MORE_INFO(NotificationCategory.COMPANY, NotificationSeverity.WARNING, true),
    BUSINESS_DOCUMENT_REVOKED(NotificationCategory.COMPANY, NotificationSeverity.DANGER, true),
    BUSINESS_DOCUMENT_EXPIRED(NotificationCategory.COMPANY, NotificationSeverity.WARNING, true),
    PUBLISH_RIGHT_LOST(NotificationCategory.COMPANY, NotificationSeverity.DANGER, true),
    COMPANY_VERIFIED(NotificationCategory.COMPANY, NotificationSeverity.SUCCESS, false),
    COMPANY_MEMBERSHIP_CHANGED(NotificationCategory.COMPANY, NotificationSeverity.WARNING, true),
    AGREEMENT_REVIEWED(NotificationCategory.COMPANY, NotificationSeverity.INFO, true),
    JOB_HIDDEN_BY_ADMIN(NotificationCategory.JOBS, NotificationSeverity.DANGER, true),
    JOB_RESTORED_BY_ADMIN(NotificationCategory.JOBS, NotificationSeverity.SUCCESS, false),
    APPLICATION_RECEIVED(NotificationCategory.APPLICATIONS, NotificationSeverity.INFO, false),
    APPLICATION_STATUS_CHANGED(NotificationCategory.APPLICATIONS, NotificationSeverity.INFO, false),
    APPLICATION_WITHDRAWN(NotificationCategory.APPLICATIONS, NotificationSeverity.INFO, false),
    ACCOUNT_RESTRICTED(NotificationCategory.ACCOUNT, NotificationSeverity.DANGER, true),
    ACCOUNT_RESTRICTION_LIFTED(NotificationCategory.ACCOUNT, NotificationSeverity.SUCCESS, true),
    ACCOUNT_ROLES_CHANGED(NotificationCategory.ACCOUNT, NotificationSeverity.INFO, true),
    SECURITY_NEW_DEVICE_LOGIN(NotificationCategory.SECURITY, NotificationSeverity.WARNING, true),
    SECURITY_SETTING_CHANGED(NotificationCategory.SECURITY, NotificationSeverity.INFO, true),
    ADMIN_REVIEW_QUEUE_ITEM(NotificationCategory.MODERATION, NotificationSeverity.INFO, false),
    ANNOUNCEMENT(NotificationCategory.SYSTEM, NotificationSeverity.INFO, false);

    private final NotificationCategory category;
    private final NotificationSeverity severity;
    private final boolean mandatory;
}
