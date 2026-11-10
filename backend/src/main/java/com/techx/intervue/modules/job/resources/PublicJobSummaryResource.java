package com.techx.intervue.modules.job.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.job.enums.ContractType;
import com.techx.intervue.modules.job.enums.JobLevel;
import com.techx.intervue.modules.job.enums.WorkingArrangement;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record PublicJobSummaryResource(
        Long id,
        String title,
        PublicJobCompanyResource company,
        JobLevel level,
        ContractType contractType,
        WorkingArrangement workingArrangement,
        String city,
        JobResource.Salary salary,
        List<SkillResource> skills,
        LocalDate deadline,
        Instant publishedAt,
        Integer boostLevel,
        String highlightLabel,
        Boolean highlighted) {}
