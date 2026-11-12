package com.techx.intervue.modules.candidate.mockinterview.requests;

import com.techx.intervue.modules.candidate.mockinterview.enums.MockInterviewFocusArea;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record StartMockInterviewRequest(
        @NotBlank(message = "Vị trí mục tiêu không được để trống") String targetRole,
        @NotBlank(message = "Cấp bậc không được để trống") String seniorityLevel,
        @NotNull(message = "Định hướng phỏng vấn không được để trống")
                MockInterviewFocusArea focusArea,
        @Min(value = 5, message = "Số lượng câu hỏi tối thiểu là 5")
                @Max(value = 10, message = "Số lượng câu hỏi tối đa là 10")
                Integer questionCount) {

    public StartMockInterviewRequest {
        if (questionCount == null) {
            questionCount = 5;
        }
    }
}
