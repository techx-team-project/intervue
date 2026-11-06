package com.techx.intervue.modules.job.requests;

import com.techx.intervue.modules.job.enums.ContractType;
import com.techx.intervue.modules.job.enums.JobLevel;
import com.techx.intervue.modules.job.enums.SalaryCurrency;
import com.techx.intervue.modules.job.enums.WorkingArrangement;
import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public record SaveJobRequest(
        @NotBlank @Size(max = 150) String title,
        JobLevel level,
        ContractType contractType,
        WorkingArrangement workingArrangement,
        @Valid Location location,
        @Valid Salary salary,
        @Size(max = 20) List<@NotNull Long> skillIds,
        @Size(max = 20000) String description,
        @Size(max = 20000) String requirements,
        @Size(max = 20000) String benefits,
        @FutureOrPresent LocalDate deadline,
        @Min(1) @Max(1000) Integer openings) {

    public record Location(@Size(max = 100) String city, @Size(max = 500) String address) {}

    public record Salary(
            boolean negotiable,
            @PositiveOrZero Long min,
            @PositiveOrZero Long max,
            SalaryCurrency currency) {}
}
