package com.techx.intervue.modules.candidate.mockinterview.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record SubmitMockFollowUpRequest(
        @NotBlank(message = "Câu trả lời bổ sung không được để trống") String followUpAnswer) {}
