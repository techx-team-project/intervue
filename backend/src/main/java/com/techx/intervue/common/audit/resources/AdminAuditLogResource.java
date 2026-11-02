package com.techx.intervue.common.audit.resources;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import java.time.Instant;
import lombok.Builder;

@Builder
public record AdminAuditLogResource(
        Long id,
        AuditActorType actorType,
        Long actorId,
        String actorEmail,
        String actorName,
        String actorRoleLabel,
        AuditAction action,
        AuditTargetType targetType,
        Long targetId,
        String targetLabel,
        String reason,
        String detail,
        String ip,
        String traceId,
        Instant createdAt) {}
