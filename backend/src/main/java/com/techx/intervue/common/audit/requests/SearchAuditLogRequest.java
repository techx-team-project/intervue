package com.techx.intervue.common.audit.requests;

import com.techx.intervue.common.audit.enums.AuditAction;
import com.techx.intervue.common.audit.enums.AuditActorType;
import com.techx.intervue.common.audit.enums.AuditTargetType;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record SearchAuditLogRequest(
        AuditActorType actorType,
        AuditAction action,
        AuditTargetType targetType,
        Long targetId,
        Instant from,
        Instant to,
        @Size(max = 100) String q) {}
