package com.techx.intervue.modules.job.requests;

import com.techx.intervue.modules.job.enums.ContractType;
import com.techx.intervue.modules.job.enums.JobLevel;
import com.techx.intervue.modules.job.enums.SalaryCurrency;
import com.techx.intervue.modules.job.enums.WorkingArrangement;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.util.List;

public record SearchJobsRequest(
        @Size(max = 100) String q,
        @Size(max = 100) String city,
        ContractType contractType,
        WorkingArrangement workingArrangement,
        JobLevel level,
        @Size(max = 10) List<@NotNull Long> skillIds,
        @PositiveOrZero Long salaryFrom,
        SalaryCurrency currency) {}
