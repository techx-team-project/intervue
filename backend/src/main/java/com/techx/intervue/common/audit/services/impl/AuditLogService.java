package com.techx.intervue.common.audit.services.impl;

import com.techx.intervue.common.audit.entities.AuditLog;
import com.techx.intervue.common.audit.repositories.AuditLogRepository;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import lombok.RequiredArgsConstructor;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditLogService implements AuditLogServiceInterface {

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
}
