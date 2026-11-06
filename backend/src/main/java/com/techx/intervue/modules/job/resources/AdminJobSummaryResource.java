package com.techx.intervue.modules.job.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.job.enums.JobLevel;
import com.techx.intervue.modules.job.enums.JobStatus;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AdminJobSummaryResource(
        Long id,
        String title,
        JobStatus status,
        Long companyId,
        String companyName,
        JobLevel level,
        String city,
        JobResource.Salary salary,
        LocalDate deadline,
        Instant publishedAt,
        String hiddenReason,
        Instant updatedAt) {}
