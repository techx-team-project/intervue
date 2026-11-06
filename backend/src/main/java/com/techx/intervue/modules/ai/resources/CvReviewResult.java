package com.techx.intervue.modules.ai.resources;

import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
public record CvReviewResult(
        Long id,
        Long candidateProfileId,
        String fileHash,
        Integer overallScore,
        String summary,
        List<CvReviewComment> comments,
        String modelVersion,
        String promptVersion,
        boolean fromCache,
        Instant createdAt) {}
