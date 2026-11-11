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
        Instant createdAt,
        Integer reviewLevel,
        Long jobId,
        String jobTitle,
        String companyName,
        Integer jobFitScore,
        List<JobRequirementMatch> requirementMatches,
        List<String> keyStrengths,
        List<String> gapAnalysis,
        List<String> tailoringTips,
        Integer chargedCredits,
        boolean refunded) {}
