package com.techx.intervue.modules.ai.requests;

public record CvReviewRequest(
        Long resumeId, String cvText, String targetPosition, Long jobId, Integer level) {

    public CvReviewRequest(Long resumeId, String cvText, String targetPosition) {
        this(resumeId, cvText, targetPosition, null, 1);
    }
}
