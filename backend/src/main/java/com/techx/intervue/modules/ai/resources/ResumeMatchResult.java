package com.techx.intervue.modules.ai.resources;

import java.time.Instant;
import java.util.List;

public record ResumeMatchResult(
        String applicationId,
        String experienceSummary,
        List<RequirementEvidenceMatch> requirements,
        List<String> questionsToAsk,
        String model,
        String promptVersion,
        boolean aiProcessedCandidateData,
        Instant analyzedAt,
        String disclaimer) {}
