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
import com.techx.intervue.modules.job.mappers.JobMapper;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.resources.JobResource;
import com.techx.intervue.modules.job.services.interfaces.JobReviewServiceInterface;
import com.techx.intervue.modules.job.services.interfaces.JobServiceInterface;
import com.techx.intervue.modules.notification.enums.NotificationType;
import com.techx.intervue.modules.notification.enums.RecipientType;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface;
import com.techx.intervue.modules.notification.services.interfaces.NotificationPublisherInterface.NotificationCommand;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobReviewService implements JobReviewServiceInterface {

    private static final String RECRUITER_JOBS_PATH = "/recruiter/jobs";

    private final JobRepository jobRepository;
    private final JobServiceInterface jobService;
    private final JobMapper jobMapper;
    private final JobStatusPolicy statusPolicy;
    private final AuditLogServiceInterface auditLogService;
    private final NotificationPublisherInterface notificationPublisher;

    @Override
    @Transactional
    public JobResource approve(Long jobId, RequestActor actor) {
        JobResource approved = jobService.publishApproved(jobId);
        Job job = require(jobId);
        audit(actor, AuditAction.JOB_APPROVED, job, null);
        notifyRecruiter(job, NotificationType.JOB_APPROVED, "—");
        return approved;
    }

    @Override
    @Transactional
    public JobResource reject(Long jobId, String reason, RequestActor actor) {
        Job job = require(jobId);
        statusPolicy.requireTransition(job.getStatus(), JobStatus.DRAFT);
        job.setStatus(JobStatus.DRAFT);
        audit(actor, AuditAction.JOB_REJECTED, job, reason.trim());
        notifyRecruiter(job, NotificationType.JOB_REJECTED, reason.trim());
        return jobMapper.toResource(job);
    }

    private Job require(Long jobId) {
        return jobRepository
                .findById(jobId)
                .filter(found -> found.getStatus() != JobStatus.DRAFT)
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
