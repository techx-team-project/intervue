package com.techx.intervue.common.audit.services.interfaces;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import lombok.Builder;

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
}
