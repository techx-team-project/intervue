package com.techx.intervue.modules.moderation.resources;

import com.techx.intervue.modules.moderation.enums.ReportReasonCode;
import com.techx.intervue.modules.moderation.enums.ReportStatus;
import com.techx.intervue.modules.moderation.enums.ReportTargetType;
import com.techx.intervue.modules.moderation.enums.ReporterType;
import java.time.Instant;
import lombok.Builder;

@Builder
public record AdminReportSummaryResource(
        Long id,
        ReporterType reporterType,
        Long reporterId,
        ReportTargetType targetType,
        Long targetId,
        ReportReasonCode reasonCode,
        ReportStatus status,
        Instant createdAt) {}
