package com.techx.intervue.modules.company.services.impl;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface;
import com.techx.intervue.common.audit.services.interfaces.AuditLogServiceInterface.AuditEntry;
import com.techx.intervue.common.web.RequestActor;
import com.techx.intervue.modules.company.entities.Company;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CompanyAuditor {

    private final AuditLogServiceInterface auditLogService;

    public void record(RequestActor actor, AuditAction action, Company company) {
        auditLogService.record(
                AuditEntry.builder()
                        .actorType(AuditActorType.USER)
                        .actorId(actor.userId())
                        .actorEmail(actor.email())
                        .action(action)
                        .targetType(AuditTargetType.COMPANY)
                        .targetId(company.getId())
                        .detail(company.getName())
                        .ip(actor.ip())
                        .build());
    }
}
