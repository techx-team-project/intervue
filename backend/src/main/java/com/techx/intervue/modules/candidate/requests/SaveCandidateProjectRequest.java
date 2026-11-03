package com.techx.intervue.modules.candidate.requests;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.List;

public record SaveCandidateProjectRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 100) String role,
        @NotNull LocalDate startDate,
        LocalDate endDate,
        @NotNull Boolean current,
        @Size(max = 2000) String description,
        @Size(max = 2000) String highlights,
        @Size(max = 255)
                @Pattern(regexp = "^$|^https?://.+", message = "Must be an http or https URL")
                String githubUrl,
        @Size(max = 255)
                @Pattern(regexp = "^$|^https?://.+", message = "Must be an http or https URL")
                String demoUrl,
        @Size(max = 15) List<@NotBlank @Size(max = 60) String> technologies) {

    @AssertTrue(message = "End date must not be before the start date or set on an ongoing project")
    public boolean isDateRangeValid() {
        if (Boolean.TRUE.equals(current)) {
            return endDate == null;
        }
        return endDate == null || startDate == null || !endDate.isBefore(startDate);
    }
}
