package com.techx.intervue.modules.job.services.impl;

import com.techx.intervue.common.audit.entities.AuditLog;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.repositories.AuditLogRepository;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.job.repositories.JobRepository;
import com.techx.intervue.modules.job.resources.JobHistoryResource;
import com.techx.intervue.modules.job.services.interfaces.JobHistoryServiceInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JobHistoryService implements JobHistoryServiceInterface {

    private static final Sort NEWEST_FIRST = Sort.by(Sort.Direction.DESC, "createdAt", "id");

    private final JobRepository jobRepository;
    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<JobHistoryResource> history(Long jobId, Long recruiterId, Pageable pageable) {
        jobRepository
                .findByIdAndRecruiterId(jobId, recruiterId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
        Pageable newestFirst =
                PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), NEWEST_FIRST);
        return auditLogRepository
                .findByTargetTypeAndTargetId(AuditTargetType.JOB, jobId, newestFirst)
                .map(this::toResource);
    }

    private JobHistoryResource toResource(AuditLog entry) {
        return JobHistoryResource.builder()
                .action(entry.getAction())
                .actorType(entry.getActorType())
                .detail(entry.getDetail())
                .reason(entry.getReason())
                .createdAt(entry.getCreatedAt())
                .build();
    }
}
