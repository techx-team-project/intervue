package com.techx.intervue.modules.candidate.mockinterview.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record SubmitMockAnswerRequest(
        @NotBlank(message = "Câu trả lời không được để trống") String answer) {}
