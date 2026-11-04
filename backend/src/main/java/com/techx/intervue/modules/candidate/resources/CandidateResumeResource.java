package com.techx.intervue.modules.candidate.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record CandidateResumeResource(
        Long id,
        String fileName,
        String url,
        Long fileSizeBytes,
        String contentType,
        boolean isDefault,
        String parsedSummary,
        Instant createdAt) {}
