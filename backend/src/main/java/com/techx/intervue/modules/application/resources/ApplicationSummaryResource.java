package com.techx.intervue.modules.application.resources;

import com.techx.intervue.modules.application.enums.ApplicationStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
public record ApplicationSummaryResource(
        Long id,
        ApplicationStatus status,
        Long jobId,
        String jobTitle,
        Long companyId,
        String companyName,
        Instant submittedAt,
        Instant updatedAt) {}
