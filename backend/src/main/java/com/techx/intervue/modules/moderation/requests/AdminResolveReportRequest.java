package com.techx.intervue.modules.moderation.requests;

import com.techx.intervue.modules.moderation.enums.ReportResolveAction;
import com.techx.intervue.modules.moderation.enums.ReporterType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AdminResolveReportRequest(
        @NotNull ReportResolveAction action,
        @Size(max = 1000) String note,
        ReporterType lockActorType,
        Long lockActorId) {}
