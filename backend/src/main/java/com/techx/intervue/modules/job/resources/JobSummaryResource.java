package com.techx.intervue.modules.job.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.job.enums.ContractType;
import com.techx.intervue.modules.job.enums.JobLevel;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.enums.WorkingArrangement;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record JobSummaryResource(
        Long id,
        String title,
        JobStatus status,
        JobLevel level,
        ContractType contractType,
        WorkingArrangement workingArrangement,
        String city,
        JobResource.Salary salary,
        int openings,
        LocalDate deadline,
        Instant publishedAt,
        Instant updatedAt) {}
