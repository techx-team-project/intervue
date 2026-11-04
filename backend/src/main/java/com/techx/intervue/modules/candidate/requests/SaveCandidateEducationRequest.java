package com.techx.intervue.modules.candidate.requests;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Year;

public record SaveCandidateEducationRequest(
        @NotBlank @Size(max = 150) String school,
        @Size(max = 100) String degree,
        @Size(max = 150) String major,
        @NotNull Integer startYear,
        Integer endYear,
        @Size(max = 20) String gpa,
        @Size(max = 2000) String achievements) {

    private static final int MIN_YEAR = 1950;
    private static final int FUTURE_YEARS = 10;

    @AssertTrue(message = "Year must be between 1950 and 10 years from now")
    public boolean isYearBoundsValid() {
        return yearInBounds(startYear) && yearInBounds(endYear);
    }

    @AssertTrue(message = "End year must not be before the start year")
    public boolean isYearRangeValid() {
        return startYear == null || endYear == null || endYear >= startYear;
    }

    private static boolean yearInBounds(Integer year) {
        return year == null || year >= MIN_YEAR && year <= Year.now().getValue() + FUTURE_YEARS;
    }
}
