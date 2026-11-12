package com.techx.intervue.modules.job.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.job.enums.ContractType;
import com.techx.intervue.modules.job.enums.JobBenefitTag;
import com.techx.intervue.modules.job.enums.JobLevel;
import com.techx.intervue.modules.job.enums.JobRole;
import com.techx.intervue.modules.job.enums.WorkingArrangement;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record PublicJobResource(
        Long id,
        String title,
        PublicJobCompanyResource company,
        JobLevel level,
        JobRole jobRole,
        JobResource.Experience experience,
        ContractType contractType,
        WorkingArrangement workingArrangement,
        JobResource.Location location,
        JobResource.Salary salary,
        List<SkillResource> skills,
        String description,
        String requirements,
        String benefits,
        List<JobBenefitTag> benefitTags,
        List<String> hiringSteps,
        int openings,
        ScreeningSummaryResource screening,
        LocalDate deadline,
        Instant publishedAt,
        Integer boostLevel,
        String highlightLabel,
        Boolean highlighted) {}
