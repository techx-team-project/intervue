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
    FOLLOWED_COMPANY_NEW_JOB(NotificationCategory.JOBS, NotificationSeverity.INFO, false),
    APPLICATIONS_WAITING_REVIEW(
            NotificationCategory.APPLICATIONS, NotificationSeverity.INFO, false),
    SAVED_JOBS_CLOSING_SOON(NotificationCategory.JOBS, NotificationSeverity.INFO, false),
    JOB_APPROVED(NotificationCategory.JOBS, NotificationSeverity.SUCCESS, true),
    JOB_REJECTED(NotificationCategory.JOBS, NotificationSeverity.DANGER, true),
    JOB_HIDDEN_BY_ADMIN(NotificationCategory.JOBS, NotificationSeverity.DANGER, true),
    JOB_RESTORED_BY_ADMIN(NotificationCategory.JOBS, NotificationSeverity.SUCCESS, false),
    JOB_HIDDEN_FOR_APPLICANT(
            NotificationCategory.APPLICATIONS, NotificationSeverity.WARNING, false),
    JOB_TERMS_CHANGED_FOR_APPLICANT(
            NotificationCategory.APPLICATIONS, NotificationSeverity.WARNING, false),
    APPLICATION_RECEIVED(NotificationCategory.APPLICATIONS, NotificationSeverity.INFO, false),
    APPLICATION_STATUS_CHANGED(NotificationCategory.APPLICATIONS, NotificationSeverity.INFO, false),
    APPLICATION_WITHDRAWN(NotificationCategory.APPLICATIONS, NotificationSeverity.INFO, false),
    INTERVIEW_INVITED(NotificationCategory.APPLICATIONS, NotificationSeverity.INFO, true),
    INTERVIEW_UPDATED(NotificationCategory.APPLICATIONS, NotificationSeverity.INFO, true),
    INTERVIEW_CANCELLED(NotificationCategory.APPLICATIONS, NotificationSeverity.WARNING, true),
    INTERVIEW_CONFIRMED(NotificationCategory.APPLICATIONS, NotificationSeverity.SUCCESS, false),
    INTERVIEW_DECLINED(NotificationCategory.APPLICATIONS, NotificationSeverity.WARNING, false),
    INTERVIEW_RESCHEDULE_REQUESTED(
            NotificationCategory.APPLICATIONS, NotificationSeverity.WARNING, true),
    INTERVIEW_REMINDER(NotificationCategory.APPLICATIONS, NotificationSeverity.INFO, true),
    ACCOUNT_RESTRICTED(NotificationCategory.ACCOUNT, NotificationSeverity.DANGER, true),
    ACCOUNT_RESTRICTION_LIFTED(NotificationCategory.ACCOUNT, NotificationSeverity.SUCCESS, true),
    ACCOUNT_ROLES_CHANGED(NotificationCategory.ACCOUNT, NotificationSeverity.INFO, true),
    SECURITY_NEW_DEVICE_LOGIN(NotificationCategory.SECURITY, NotificationSeverity.WARNING, true),
    SECURITY_SETTING_CHANGED(NotificationCategory.SECURITY, NotificationSeverity.INFO, true),
    IDENTITY_VERIFIED(NotificationCategory.ACCOUNT, NotificationSeverity.INFO, true),
    IDENTITY_REJECTED(NotificationCategory.ACCOUNT, NotificationSeverity.WARNING, true),
    JOB_REPORT_THRESHOLD_REACHED(
            NotificationCategory.MODERATION, NotificationSeverity.WARNING, false),
    ADMIN_REVIEW_QUEUE_ITEM(NotificationCategory.MODERATION, NotificationSeverity.INFO, false),
    ANNOUNCEMENT(NotificationCategory.SYSTEM, NotificationSeverity.INFO, false),
    ORDER_CREATED(NotificationCategory.COMPANY, NotificationSeverity.INFO, true),
    ORDER_PAID(NotificationCategory.COMPANY, NotificationSeverity.SUCCESS, true),
    ORDER_UNDERPAID(NotificationCategory.COMPANY, NotificationSeverity.WARNING, true),
    ORDER_EXPIRED_UNDERPAID(NotificationCategory.COMPANY, NotificationSeverity.WARNING, true),
    ORDER_EXPIRED_WITH_PAYMENT(
            NotificationCategory.MODERATION, NotificationSeverity.WARNING, false),
    AD_CREATIVE_APPROVED(NotificationCategory.COMPANY, NotificationSeverity.SUCCESS, true),
    AD_CREATIVE_REJECTED(NotificationCategory.COMPANY, NotificationSeverity.DANGER, true),
    AD_WEEK_STARTING_SOON_NO_CREATIVE(
            NotificationCategory.COMPANY, NotificationSeverity.WARNING, true),
    REFUND_APPROVED(NotificationCategory.COMPANY, NotificationSeverity.SUCCESS, true),
    REFUND_REJECTED(NotificationCategory.COMPANY, NotificationSeverity.WARNING, true),
    CONNECT_INVITATION_RECEIVED(NotificationCategory.CONNECTIONS, NotificationSeverity.INFO, false),
    CONNECT_INVITATION_ACCEPTED(
            NotificationCategory.CONNECTIONS, NotificationSeverity.SUCCESS, false),
    CONNECT_INVITATION_DECLINED(
            NotificationCategory.CONNECTIONS, NotificationSeverity.WARNING, false),
    REPORT_DISMISSED(NotificationCategory.MODERATION, NotificationSeverity.INFO, false),
    REPORT_RESOLVED(NotificationCategory.MODERATION, NotificationSeverity.INFO, false);

    private final NotificationCategory category;
    private final NotificationSeverity severity;
    private final boolean mandatory;
}
