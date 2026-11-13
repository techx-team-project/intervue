package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.job.entities.Job;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.events.JobHiddenEvent;
import com.techx.intervue.modules.job.mappers.JobMapper;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.repositories.JobRepository.StatusCount;
import com.techx.intervue.modules.job.repositories.JobSpecifications;
import com.techx.intervue.modules.job.requests.AdminSearchJobsRequest;
import com.techx.intervue.modules.job.resources.AdminJobSummaryResource;
import com.techx.intervue.modules.job.resources.JobContentWarningResource;
import com.techx.intervue.modules.job.resources.JobResource;
import com.techx.intervue.modules.job.resources.JobStatusCountsResource;
import com.techx.intervue.modules.job.services.interfaces.AdminJobServiceInterface;
import com.techx.intervue.modules.moderation.services.interfaces.JobContentPortInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import java.time.Instant;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminJobService implements AdminJobServiceInterface, JobContentPortInterface {

    private static final String RECRUITER_JOBS_PATH = "/recruiter/jobs";

    private final JobRepository jobRepository;
    private final JobMapper jobMapper;
    private final JobStatusPolicy statusPolicy;
    private final AuditLogServiceInterface auditLogService;
    private final NotificationPublisherInterface notificationPublisher;
    private final ApplicationEventPublisher eventPublisher;
    private final JobContentScreener contentScreener;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminJobSummaryResource> search(AdminSearchJobsRequest request, Pageable pageable) {
        return jobRepository
                .findAll(JobSpecifications.adminListing(request), pageable)
                .map(jobMapper::toAdminSummary);
    }

    @Override
    @Transactional(readOnly = true)
    public JobStatusCountsResource countByStatus() {
        Map<JobStatus, Long> counts = new EnumMap<>(JobStatus.class);
        for (JobStatus status : JobStatus.values()) {
            counts.put(status, 0L);
        }
        long total = 0;
        for (StatusCount row : jobRepository.countByStatus()) {
            if (row.getStatus() != JobStatus.DRAFT) {
                counts.put(row.getStatus(), row.getTotal());
                total += row.getTotal();
            }
        }
        return new JobStatusCountsResource(total, counts);
    }

    @Override
    @Transactional(readOnly = true)
    public JobResource findOne(Long jobId) {
        return jobMapper.toResource(require(jobId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobContentWarningResource> contentWarnings(Long jobId) {
        return contentScreener.warningsOf(require(jobId));
    }

    @Override
    @Transactional
    public JobResource hide(Long jobId, String reason, RequestActor actor) {
        Job job = require(jobId);
        statusPolicy.requireTransition(job.getStatus(), JobStatus.HIDDEN_BY_ADMIN);
        job.setStatus(JobStatus.HIDDEN_BY_ADMIN);
        job.setHiddenReason(reason.trim());
        job.setHiddenAt(Instant.now());
        job.setHiddenBy(actor.userId());
        audit(actor, AuditAction.JOB_HIDDEN, job, reason.trim());
        notifyRecruiter(job, NotificationType.JOB_HIDDEN_BY_ADMIN, reason.trim());
        eventPublisher.publishEvent(new JobHiddenEvent(job.getId()));
        return jobMapper.toResource(job);
    }

    @Override
    public void hideJob(Long jobId, String reason, RequestActor actor) {
        hide(jobId, reason, actor);
    }

    @Override
    @Transactional
    public JobResource restore(Long jobId, RequestActor actor) {
        Job job = require(jobId);
        JobStatus target =
                job.getDeadline() != null && !job.getDeadline().isBefore(JobDeadlines.today())
                        ? JobStatus.PUBLISHED
                        : JobStatus.EXPIRED;
        statusPolicy.requireTransition(job.getStatus(), target);
        job.setStatus(target);
        job.setHiddenReason(null);
        job.setHiddenAt(null);
        job.setHiddenBy(null);
        audit(actor, AuditAction.JOB_RESTORED, job, null);
        notifyRecruiter(job, NotificationType.JOB_RESTORED_BY_ADMIN, "—");
        return jobMapper.toResource(job);
    }

    private Job require(Long jobId) {
        return jobRepository
                .findById(jobId)
                .filter(job -> job.getStatus() != JobStatus.DRAFT)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    private void audit(RequestActor actor, AuditAction action, Job job, String reason) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.ADMIN)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(AuditTargetType.JOB)
                        .targetId(job.getId())
                        .reason(reason)
                        .detail(job.getTitle())
                        .ip(actor.ip())
                        .build());
    }

    private void notifyRecruiter(Job job, NotificationType type, String reason) {
        notificationPublisher.publish(
                NotificationCommand.builder()
                        .recipientType(RecipientType.RECRUITER)
                        .recipientId(job.getRecruiterId())
                        .type(type)
                        .params(Map.of("jobTitle", job.getTitle(), "reason", reason))
                        .actionUrl(RECRUITER_JOBS_PATH)
                        .build());
    }
}
