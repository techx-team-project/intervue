package com.techx.intervue.modules.moderation.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.moderation.entities.Report;
import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import com.techx.intervue.modules.moderation.enums.ReportResolveAction;
import com.techx.intervue.modules.moderation.enums.ReportStatus;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.enums.ReporterType;
import com.techx.intervue.modules.moderation.mappers.ReportMapper;
import com.techx.intervue.modules.moderation.repositories.ReportRepository;
import com.techx.intervue.modules.moderation.repositories.ReportSpecifications;
import com.techx.intervue.modules.moderation.resources.AdminReportDetailResource;
import com.techx.intervue.modules.moderation.resources.AdminReportSummaryResource;
import com.techx.intervue.modules.moderation.services.interfaces.ConversationContentPortInterface;
import com.techx.intervue.modules.moderation.services.interfaces.ReportServiceInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import com.techx.intervue.modules.user.requests.RestrictUserRequest;
import com.techx.intervue.modules.user.services.interfaces.UserAdminServiceInterface;
import java.time.Instant;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService implements ReportServiceInterface {

    private static final String LOCK_REASON = "Vi phạm quy tắc cộng đồng InterVue Connect";

    // recruiter_refresh_tokens.revoked_reason is VARCHAR(32) - keep this short and code-like,
    // same style as RecruiterService's own DELETION_REQUESTED_REASON/ACCOUNT_PURGED_REASON.
    private static final String RECRUITER_SUSPEND_REASON = "CONNECT_VIOLATION";

    private final ReportRepository reportRepository;
    private final ReportMapper reportMapper;
    private final ConversationContentPortInterface contentHidePort;
    private final UserAdminServiceInterface userAdminService;
    private final RecruiterServiceInterface recruiterService;
    private final NotificationPublisherInterface notificationPublisher;
    private final AuditLogServiceInterface auditLogService;

    @Override
    @Transactional
    public void file(
            ReporterType reporterType,
            Long reporterId,
            ReportTargetType targetType,
            Long targetId,
            ReportReasonCode reasonCode,
            String reasonNote) {
        reportRepository.save(
                Report.builder()
                        .reporterType(reporterType)
                        .reporterId(reporterId)
                        .targetType(targetType)
                        .targetId(targetId)
                        .reasonCode(reasonCode)
                        .reasonNote(reasonNote)
                        .status(ReportStatus.PENDING)
                        .build());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminReportSummaryResource> search(
            ReportTargetType targetType, ReportStatus status, Pageable pageable) {
        return reportRepository
                .findAll(ReportSpecifications.matching(targetType, status), pageable)
                .map(reportMapper::toSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminReportDetailResource get(Long reportId) {
        return reportMapper.toDetail(requireReport(reportId));
    }

    @Override
    @Transactional
    public void dismiss(Long reportId, String note, RequestActor actor) {
        Report report = requirePending(reportId);
        report.setStatus(ReportStatus.DISMISSED);
        report.setAdminNote(note);
        report.setReviewedByUserId(actor.userId());
        report.setReviewedAt(Instant.now());

        notifyReporter(
                report, NotificationType.REPORT_DISMISSED, Map.of("note", blankToDash(note)));
        audit(actor, AuditAction.REPORT_DISMISSED, report.getId(), null);
    }

    @Override
    @Transactional
    public void resolve(
            Long reportId,
            ReportResolveAction action,
            String note,
            ReporterType lockActorType,
            Long lockActorId,
            RequestActor actor) {
        Report report = requirePending(reportId);

        switch (action) {
            case HIDE_CONTENT -> contentHidePort.hideContent(report.getTargetId());
            case LOCK_ACCOUNT -> lockAccount(lockActorType, lockActorId, note, actor);
            case NONE -> {
                // Reviewed, nothing punitive - the note alone is the outcome.
            }
        }

        report.setStatus(ReportStatus.ACTION_TAKEN);
        report.setAdminNote(note);
        report.setReviewedByUserId(actor.userId());
        report.setReviewedAt(Instant.now());

        notifyReporter(
                report,
                NotificationType.REPORT_RESOLVED,
                Map.of("action", describe(action), "note", blankToDash(note)));
        audit(actor, AuditAction.REPORT_RESOLVED, report.getId(), action.name());
    }

    private void lockAccount(
            ReporterType lockActorType, Long lockActorId, String note, RequestActor actor) {
        if (lockActorType == null || lockActorId == null || lockActorType == ReporterType.SYSTEM) {
            throw AppException.validation(
                    "lockActorType", "Specify which candidate or recruiter account to lock");
        }
        if (lockActorType == ReporterType.CANDIDATE) {
            userAdminService.restrict(
                    lockActorId,
                    new RestrictUserRequest(LOCK_REASON, blankToNull(note), true, null),
                    actor);
        } else {
            recruiterService.suspend(lockActorId, RECRUITER_SUSPEND_REASON);
        }
    }

    private void notifyReporter(Report report, NotificationType type, Map<String, Object> params) {
        if (report.getReporterType() == ReporterType.SYSTEM) {
            return;
        }
        RecipientType recipientType =
                report.getReporterType() == ReporterType.CANDIDATE
                        ? RecipientType.USER
                        : RecipientType.RECRUITER;
        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(recipientType)
                        .recipientId(report.getReporterId())
                        .type(type)
                        .params(params)
                        .actionUrl(
                                recipientType == RecipientType.USER
                                        ? "/candidate/conversations"
                                        : "/recruiter/conversations")
                        .build());
    }

    private void audit(RequestActor actor, AuditAction action, Long reportId, String detail) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(AuditTargetType.REPORT)
                        .targetId(reportId)
                        .detail(detail)
                        .ip(actor.ip())
                        .build());
    }

    private String describe(ReportResolveAction action) {
        return switch (action) {
            case NONE -> "Không có hành động nào";
            case HIDE_CONTENT -> "Ẩn nội dung cuộc trò chuyện";
            case LOCK_ACCOUNT -> "Khoá tài khoản vi phạm";
        };
    }

    private String blankToDash(String value) {
        return value == null || value.isBlank() ? "—" : value;
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }

    private Report requireReport(Long reportId) {
        return reportRepository
                .findById(reportId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private Report requirePending(Long reportId) {
        Report report = requireReport(reportId);
        if (report.getStatus() != ReportStatus.PENDING) {
            throw new AppException(ErrorCode.REPORT_ALREADY_REVIEWED);
        }
        return report;
    }
}
