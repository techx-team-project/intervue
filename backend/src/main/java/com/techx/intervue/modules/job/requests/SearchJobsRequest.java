package com.techx.intervue.modules.job.requests;

import com.techx.intervue.modules.job.enums.ContractType;
import com.techx.intervue.modules.job.enums.JobLevel;
import com.techx.intervue.modules.job.enums.JobRole;
import com.techx.intervue.modules.job.enums.JobSort;
import com.techx.intervue.modules.job.enums.SalaryCurrency;
import com.techx.intervue.modules.job.enums.WorkingArrangement;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.List;

public record SearchJobsRequest(
        @Size(max = 100) String q,
        @Size(max = 100) String city,
        Long companyId,
        ContractType contractType,
        WorkingArrangement workingArrangement,
        JobLevel level,
        @Size(max = 10) List<@NotNull Long> skillIds,
        @PositiveOrZero @Max(JobLimits.MAX_SALARY_VND) Long salaryFrom,
        SalaryCurrency currency,
        @Min(1) @Max(90) Integer postedWithinDays,
        JobSort sort,
        JobRole jobRole,
        @Min(0) @Max(30) Integer experienceYears) {

    public SearchJobsRequest(
            String q,
            String city,
            Long companyId,
            ContractType contractType,
            WorkingArrangement workingArrangement,
            JobLevel level,
            List<Long> skillIds,
            Long salaryFrom,
            SalaryCurrency currency) {
        this(
                q,
                city,
                companyId,
                contractType,
                workingArrangement,
                level,
                skillIds,
                salaryFrom,
                currency,
                null,
                null,
                null,
                null);
    }
}
