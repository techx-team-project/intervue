package com.techx.intervue.modules.application.requests;

import com.techx.intervue.modules.application.enums.InterviewFormat;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record ScheduleInterviewRequest(
        @NotNull @Future Instant startsAt,
        @NotNull @Min(15) @Max(480) Integer durationMinutes,
        @NotNull InterviewFormat format,
        @NotBlank @Size(max = 500) String location,
        @Size(max = 1000) String note) {}
