package com.techx.intervue.modules.moderation.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import com.techx.intervue.modules.moderation.enums.ReportStatus;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.enums.ReporterType;
import java.time.Instant;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AdminReportDetailResource(
        Long id,
        ReporterType reporterType,
        Long reporterId,
        ReportTargetType targetType,
        Long targetId,
        ReportReasonCode reasonCode,
        String reasonNote,
        ReportStatus status,
        String adminNote,
        Long reviewedByUserId,
        Instant reviewedAt,
        Instant createdAt) {}
