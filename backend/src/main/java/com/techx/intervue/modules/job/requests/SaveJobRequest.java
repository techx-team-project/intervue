package com.techx.intervue.modules.job.requests;

import com.techx.intervue.modules.job.enums.ContractType;
import com.techx.intervue.modules.job.enums.JobBenefitTag;
import com.techx.intervue.modules.job.enums.JobLevel;
import com.techx.intervue.modules.job.enums.JobRole;
import com.techx.intervue.modules.job.enums.SalaryBasis;
import com.techx.intervue.modules.job.enums.SalaryCurrency;
import com.techx.intervue.modules.job.enums.ScreeningQuestionType;
import com.techx.intervue.modules.job.enums.WorkingArrangement;
import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record SaveJobRequest(
        @NotBlank @Size(max = 150) String title,
        JobLevel level,
        JobRole jobRole,
        @Valid Experience experience,
        ContractType contractType,
        WorkingArrangement workingArrangement,
        @Valid Location location,
        @Valid Salary salary,
        @Size(max = 20) List<@NotNull Long> skillIds,
        @Size(max = 20000) String description,
        @Size(max = 20000) String requirements,
        @Size(max = 20000) String benefits,
        @Size(max = 10) List<@NotNull JobBenefitTag> benefitTags,
        @Size(max = 6) List<@NotBlank @Size(max = 80) String> hiringSteps,
        @FutureOrPresent LocalDate deadline,
        @Min(1) @Max(1000) Integer openings,
        @Valid @Size(max = 5) List<@NotNull ScreeningQuestion> screeningQuestions) {

    public record Location(
            @Size(max = 100) String city,
            @Size(max = 500) String address,
            @DecimalMin("-90") @DecimalMax("90") BigDecimal latitude,
            @DecimalMin("-180") @DecimalMax("180") BigDecimal longitude) {

        @AssertTrue
        public boolean isCoordinatePairComplete() {
            return (latitude == null) == (longitude == null);
        }
    }

    public record ScreeningQuestion(
            @NotNull ScreeningQuestionType type,
            @NotBlank @Size(max = 300) String prompt,
            boolean required,
            @Size(max = 6) List<@NotBlank @Size(max = 100) String> options) {}

    public record Salary(
            boolean negotiable,
            @PositiveOrZero Long min,
            @PositiveOrZero Long max,
            SalaryCurrency currency,
            SalaryBasis basis) {}

    public record Experience(@Min(0) @Max(30) Integer minYears, @Min(0) @Max(30) Integer maxYears) {

        @AssertTrue
        public boolean isRangeValid() {
            return minYears == null || maxYears == null || minYears <= maxYears;
        }
    }
}
