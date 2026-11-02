package com.techx.intervue.common.audit.services.interfaces;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import com.techx.intervue.common.audit.requests.SearchAuditLogRequest;
import com.techx.intervue.common.audit.resources.AdminAuditLogResource;
import lombok.Builder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditLogServiceInterface {

    @Builder
    record AuditEntry(
            AuditActorType actorType,
            Long actorId,
            String actorEmail,
            AuditAction action,
            AuditTargetType targetType,
            Long targetId,
            String reason,
            String detail,
            String ip) {}

    void record(AuditEntry entry);

    Page<AdminAuditLogResource> search(SearchAuditLogRequest request, Pageable pageable);
}
