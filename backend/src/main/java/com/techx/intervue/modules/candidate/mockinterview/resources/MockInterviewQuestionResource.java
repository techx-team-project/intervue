package com.techx.intervue.modules.candidate.mockinterview.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record MockInterviewQuestionResource(
        Long id,
        Integer questionOrder,
        String category,
        String questionText,
        String candidateAnswer,
        Instant answeredAt,
        String followUpQuestion,
        String followUpAnswer,
        Instant followUpAnsweredAt,
        String feedback,
        Integer score,
        String idealAnswer) {}
