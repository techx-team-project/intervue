package com.techx.intervue.modules.jobalert.requests;

import com.techx.intervue.modules.job.requests.JobLimits;
import com.techx.intervue.modules.jobalert.enums.AlertFrequency;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record UpdateJobAlertRequest(
        @NotBlank @Size(max = 150) String title,
        @Size(max = 255) String keyword,
        @Size(max = 100) String city,
        @Size(max = 30) String careerLevel,
        @Size(max = 30) String workMode,
        @PositiveOrZero @Max(JobLimits.MAX_SALARY_VND) Long salaryMin,
        @Size(max = 10) String currency,
        AlertFrequency frequency,
        Boolean isActive) {}
