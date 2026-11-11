package com.techx.intervue.modules.candidate.mockinterview.resources;

import com.techx.intervue.modules.candidate.mockinterview.enums.MockInterviewFocusArea;
import com.techx.intervue.modules.candidate.mockinterview.enums.MockInterviewStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
public record MockInterviewSummaryResource(
        Long id,
        String targetRole,
        String seniorityLevel,
        MockInterviewFocusArea focusArea,
        Integer questionCount,
        Integer currentQuestionIndex,
        MockInterviewStatus status,
        Integer overallScore,
        Instant createdAt,
        Instant updatedAt) {}
