package com.techx.intervue.modules.job.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.job.enums.ApplicationMode;
import com.techx.intervue.modules.job.enums.ContractType;
import com.techx.intervue.modules.job.enums.JobLevel;
import com.techx.intervue.modules.job.enums.JobStatus;
import com.techx.intervue.modules.job.enums.SalaryCurrency;
import com.techx.intervue.modules.job.enums.WorkingArrangement;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record JobResource(
        Long id,
        String title,
        JobStatus status,
        String companyName,
        JobLevel level,
        ContractType contractType,
        WorkingArrangement workingArrangement,
        Location location,
        Salary salary,
        List<SkillResource> skills,
        String description,
        String requirements,
        String benefits,
        ApplicationMode applicationMode,
        List<ScreeningQuestionResource> screeningQuestions,
        int openings,
        LocalDate deadline,
        Instant publishedAt,
        String hiddenReason,
        Instant hiddenAt,
        Integer boostLevel,
        Instant boostExpiresAt,
        String highlightLabel,
        Instant highlightLabelExpiresAt,
        Boolean highlighted,
        Instant highlightExpiresAt,
        Instant createdAt,
        Instant updatedAt) {

    public record Location(
            String city, String address, BigDecimal latitude, BigDecimal longitude) {}

    public record Salary(boolean negotiable, Long min, Long max, SalaryCurrency currency) {}
}
