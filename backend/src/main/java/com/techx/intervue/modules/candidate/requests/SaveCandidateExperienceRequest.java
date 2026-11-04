package com.techx.intervue.modules.candidate.requests;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public record SaveCandidateExperienceRequest(
        @NotBlank @Size(max = 120) String title,
        @NotBlank @Size(max = 150) String companyName,
        @Size(max = 100) String location,
        @NotNull LocalDate startDate,
        LocalDate endDate,
        @NotNull Boolean current,
        @Size(max = 2000) String description,
        @Size(max = 2000) String achievements,
        @Size(max = 15) List<@NotBlank @Size(max = 60) String> skills) {

    @AssertTrue(message = "End date must not be before the start date or set on a current job")
    public boolean isDateRangeValid() {
        if (Boolean.TRUE.equals(current)) {
            return endDate == null;
        }
        return endDate == null || startDate == null || !endDate.isBefore(startDate);
    }
}
