package com.techx.intervue.modules.candidate.mockinterview.resources;

import com.techx.intervue.modules.candidate.mockinterview.enums.MockInterviewFocusArea;
import com.techx.intervue.modules.candidate.mockinterview.enums.MockInterviewStatus;
import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
public record MockInterviewDetailResource(
        Long id,
        Long candidateId,
        String targetRole,
        String seniorityLevel,
        MockInterviewFocusArea focusArea,
        Integer questionCount,
        Integer currentQuestionIndex,
        MockInterviewStatus status,
        Integer overallScore,
        String overallFeedback,
        List<String> strengths,
        List<String> improvements,
        List<MockInterviewQuestionResource> questions,
        Instant createdAt,
        Instant updatedAt) {}
