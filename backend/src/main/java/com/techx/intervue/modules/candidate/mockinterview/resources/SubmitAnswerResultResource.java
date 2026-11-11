package com.techx.intervue.modules.candidate.mockinterview.resources;

import lombok.Builder;

@Builder
public record SubmitAnswerResultResource(
        Long questionId,
        Integer questionOrder,
        boolean needsFollowUp,
        String followUpQuestion,
        String feedback,
        Integer score,
        String idealAnswer,
        boolean sessionCompleted,
        MockInterviewQuestionResource nextQuestion,
        MockInterviewDetailResource completedSession) {}
