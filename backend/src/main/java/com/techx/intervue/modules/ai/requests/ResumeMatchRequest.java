package com.techx.intervue.modules.ai.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record ResumeMatchRequest(
        String applicationId,
        @NotBlank String jobTitle,
        @NotEmpty List<String> jobRequirements,
        String jobDescription,
        CandidateRawData candidateData,
        String cvText) {}
