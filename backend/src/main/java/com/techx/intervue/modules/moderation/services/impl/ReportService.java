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
import com.techx.intervue.modules.moderation.services.interfaces.JobContentPortInterface;
import com.techx.intervue.modules.moderation.services.interfaces.ReportServiceInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import com.techx.intervue.modules.user.requests.RestrictUserRequest;
import com.techx.intervue.modules.user.services.interfaces.UserAdminServiceInterface;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReportService implements ReportServiceInterface {

    private static final String LOCK_REASON =
            "Violation of the InterVue Connect community guidelines";
    private static final String JOB_HIDE_REASON = "The job post violates content rules";

    // recruiter_refresh_tokens.revoked_reason is VARCHAR(32) - keep this short and code-like,
    // same style as RecruiterService's own DELETION_REQUESTED_REASON/ACCOUNT_PURGED_REASON.
    private static final String RECRUITER_SUSPEND_REASON = "CONNECT_VIOLATION";
    private static final Pattern SYSTEM_ACTOR_PATTERN =
            Pattern.compile("Actor:\\s*(CANDIDATE|RECRUITER)#(\\d+)");

    private final ReportRepository reportRepository;
    private final ReportMapper reportMapper;
    private final ConversationContentPortInterface contentHidePort;
    private final JobContentPortInterface jobContentPort;
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
    public boolean existsPending(
            ReportTargetType targetType,
            Long targetId,
            ReporterType reporterType,
            Long reporterId) {
        return reporterId == null
                ? reportRepository
                        .existsByTargetTypeAndTargetIdAndReporterTypeAndReporterIdIsNullAndStatus(
                                targetType, targetId, reporterType, ReportStatus.PENDING)
                : reportRepository
                        .existsByTargetTypeAndTargetIdAndReporterTypeAndReporterIdAndStatus(
                                targetType,
                                targetId,
                                reporterType,
                                reporterId,
                                ReportStatus.PENDING);
    }

    @Override
    @Transactional(readOnly = true)
    public long countPending(ReportTargetType targetType, Long targetId) {
        return reportRepository.countByTargetTypeAndTargetIdAndStatus(
                targetType, targetId, ReportStatus.PENDING);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PendingTarget> mostReported(ReportTargetType targetType, int limit) {
        return reportRepository
                .countPendingByTarget(targetType, ReportStatus.PENDING, PageRequest.of(0, limit))
                .stream()
                .map(row -> new PendingTarget(row.getTargetId(), row.getTotal()))
                .toList();
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
            case HIDE_CONTENT -> hideContent(report, note, actor);
            case LOCK_ACCOUNT -> {
                if (report.getTargetType() == ReportTargetType.JOB_POST) {
                    throw AppException.validation(
                            "action", "Locking an account is not supported for job reports");
                }
                lockAccount(report, lockActorType, lockActorId, note, actor);
            }
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

    private void hideContent(Report report, String note, RequestActor actor) {
        if (report.getTargetId() == null || report.getTargetId() <= 0) {
            throw AppException.validation("action", "No content exists to hide for this report");
        }
        if (report.getTargetType() == ReportTargetType.JOB_POST) {
            jobContentPort.hideJob(
                    report.getTargetId(),
                    note == null || note.isBlank() ? JOB_HIDE_REASON : note,
                    actor);
            return;
        }
        contentHidePort.hideContent(report.getTargetId());
    }

    private void lockAccount(
            Report report,
            ReporterType lockActorType,
            Long lockActorId,
            String note,
            RequestActor actor) {
        ReporterType resolvedType = lockActorType;
        Long resolvedId = lockActorId;

        if (resolvedId == null
                && report.getReporterType() == ReporterType.SYSTEM
                && report.getReasonNote() != null) {
            Matcher matcher = SYSTEM_ACTOR_PATTERN.matcher(report.getReasonNote());
            if (matcher.find()) {
                resolvedType = ReporterType.valueOf(matcher.group(1));
                resolvedId = Long.parseLong(matcher.group(2));
            }
        }

        if (resolvedId == null
                && report.getTargetType() == ReportTargetType.CONVERSATION
                && report.getTargetId() != null
                && report.getTargetId() > 0) {
            var participantsOpt = contentHidePort.findParticipants(report.getTargetId());
            if (participantsOpt.isPresent()) {
                var participants = participantsOpt.get();
                if (resolvedType == null) {
                    resolvedType =
                            report.getReporterType() == ReporterType.RECRUITER
                                    ? ReporterType.CANDIDATE
                                    : ReporterType.RECRUITER;
                }
                resolvedId =
                        resolvedType == ReporterType.CANDIDATE
                                ? participants.candidateId()
                                : participants.initiatedByRecruiterId();
            }
        }

        if (resolvedType == null || resolvedId == null || resolvedType == ReporterType.SYSTEM) {
            throw AppException.validation(
                    "lockActorType", "Specify which candidate or recruiter account to lock");
        }
        if (resolvedType == ReporterType.CANDIDATE) {
            userAdminService.restrict(
                    resolvedId,
                    new RestrictUserRequest(LOCK_REASON, blankToNull(note), true, null),
                    actor);
        } else {
            recruiterService.suspend(resolvedId, RECRUITER_SUSPEND_REASON);
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
                        .actionUrl(actionUrlOf(report, recipientType))
                        .build());
    }

    private String actionUrlOf(Report report, RecipientType recipientType) {
        if (report.getTargetType() == ReportTargetType.JOB_POST) {
            return "/jobs";
        }
        return recipientType == RecipientType.USER
                ? "/candidate/conversations"
                : "/recruiter/conversations";
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
            case NONE -> "No action taken";
            case HIDE_CONTENT -> "Reported content hidden";
            case LOCK_ACCOUNT -> "Offending account locked";
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
