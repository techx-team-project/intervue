package com.techx.intervue.modules.company.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record RecruiterVerificationProfileResource(
        int level,
        int stepsCompleted,
        int stepsTotal,
        int completionPercent,
        boolean canPublish,
        String blockedReason,
        Long companyId,
        List<VerificationStepResource> steps) {}
