package com.techx.intervue.modules.application.resources;

import com.techx.intervue.modules.application.enums.ApplicationStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
public record RecruiterApplicationSummaryResource(
        Long id,
        ApplicationStatus status,
        Long jobId,
        String jobTitle,
        String candidateName,
        String candidateEmail,
        boolean viewed,
        Instant submittedAt,
        Instant updatedAt) {}
