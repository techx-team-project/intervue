package com.techx.intervue.common.audit.services.impl;

import com.techx.intervue.common.audit.entities.AuditLog;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.repositories.AuditLogRepository;
import com.techx.intervue.common.audit.requests.SearchAuditLogRequest;
import com.techx.intervue.common.audit.resources.AdminAuditLogResource;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.specifications.AuditLogSpecifications;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogService implements AuditLogServiceInterface {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "createdAt");
    private static final Sort TIE_BREAKER = Sort.by(Sort.Direction.DESC, "id");

    private final AuditLogRepository auditLogRepository;

    @Override
    @Transactional
    public void record(AuditEntry entry) {
        auditLogRepository.save(
                AuditLog.builder()
                        .actorType(entry.actorType())
                        .actorId(entry.actorId())
                        .actorEmail(entry.actorEmail())
                        .action(entry.action())
                        .targetType(entry.targetType())
                        .targetId(entry.targetId())
                        .reason(entry.reason())
                        .detail(entry.detail())
                        .ip(entry.ip())
                        .traceId(MDC.get("traceId"))
                        .build());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdminAuditLogResource> search(SearchAuditLogRequest request, Pageable pageable) {
        Pageable stablePageable = withStableOrder(pageable);
        Specification<AuditLog> spec = AuditLogSpecifications.from(request);
        Page<AuditLog> page = auditLogRepository.findAll(spec, stablePageable);
        return page.map(this::toResource);
    }

    private Pageable withStableOrder(Pageable pageable) {
        Sort requested = pageable.getSort().isSorted() ? pageable.getSort() : DEFAULT_SORT;
        return PageRequest.of(
                pageable.getPageNumber(), pageable.getPageSize(), requested.and(TIE_BREAKER));
    }

    private AdminAuditLogResource toResource(AuditLog log) {
        String actorName = resolveActorName(log);
        String actorRoleLabel = resolveActorRoleLabel(log.getActorType());
        String targetLabel = resolveTargetLabel(log.getTargetType(), log.getTargetId());

        return AdminAuditLogResource.builder()
                .id(log.getId())
                .actorType(log.getActorType())
                .actorId(log.getActorId())
                .actorEmail(log.getActorEmail())
                .actorName(actorName)
                .actorRoleLabel(actorRoleLabel)
                .action(log.getAction())
                .targetType(log.getTargetType())
                .targetId(log.getTargetId())
                .targetLabel(targetLabel)
                .reason(log.getReason())
                .detail(log.getDetail())
                .ip(log.getIp())
                .traceId(log.getTraceId())
                .createdAt(log.getCreatedAt())
                .build();
    }

    private String resolveActorName(AuditLog log) {
        if (log.getActorType() == AuditActorType.SYSTEM) {
            return "System";
        }
        if (log.getActorType() == AuditActorType.RECRUITER) {
            return "Recruiter #" + log.getActorId();
        }
        return log.getActorEmail() != null ? log.getActorEmail() : "Admin";
    }

    private String resolveActorRoleLabel(AuditActorType actorType) {
        return switch (actorType) {
            case SYSTEM -> "System";
            case ADMIN -> "Platform Admin";
            case USER -> "User";
            case RECRUITER -> "Recruiter";
        };
    }

    private String resolveTargetLabel(AuditTargetType targetType, Long targetId) {
        if (targetId == null) {
            return targetType.name();
        }
        return targetType.name() + " #" + targetId;
    }
}
