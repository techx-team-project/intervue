package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.company.enums.VerificationStepId;
import com.techx.intervue.modules.company.enums.VerificationStepStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record VerificationStepResource(
        VerificationStepId stepId,
        VerificationStepStatus status,
        Instant completedAt,
        String reviewReason,
        Instant expiresAt) {}
