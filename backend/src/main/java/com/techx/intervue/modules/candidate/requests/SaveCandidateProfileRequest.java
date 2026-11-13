package com.techx.intervue.modules.candidate.requests;

import com.techx.intervue.modules.candidate.enums.CareerLevel;
import com.techx.intervue.modules.candidate.enums.ContractType;
import com.techx.intervue.modules.candidate.enums.Gender;
import com.techx.intervue.modules.candidate.enums.JobSearchStatus;
import com.techx.intervue.modules.candidate.enums.WorkMode;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Year;
import java.util.List;

public record SaveCandidateProfileRequest(
        @NotBlank String name,
        @Size(max = 120) String headline,
        @Size(max = 2000) String bio,
        @Email @Size(max = 255) String contactEmail,
        @Size(max = 255) String address,
        Gender gender,
        @Min(1950) Integer birthYear,
        @NotNull Boolean showPersonalDetails,
        @NotNull Boolean searchableByRecruiters,
        @NotNull JobSearchStatus jobSearchStatus,
        @Size(max = 255)
                @Pattern(regexp = "^$|^https?://.+", message = "Must be an http or https URL")
                String githubUrl,
        @Size(max = 255)
                @Pattern(regexp = "^$|^https?://.+", message = "Must be an http or https URL")
                String linkedinUrl,
        @Size(max = 255)
                @Pattern(regexp = "^$|^https?://.+", message = "Must be an http or https URL")
                String portfolioUrl,
        @NotBlank String desiredRole,
        CareerLevel desiredLevel,
        @PositiveOrZero BigDecimal totalYoe,
        @NotNull Boolean salaryNegotiable,
        @PositiveOrZero @Max(250_000_000) Long salaryMin,
        @PositiveOrZero @Max(250_000_000) Long salaryMax,
        @Size(max = 10) String currency,
        @Size(max = 20) String salaryPeriod,
        WorkMode workMode,
        ContractType contractType,
        @Size(max = 5) List<@NotBlank @Size(max = 100) String> preferredLocations,
        @Size(max = 5) List<@NotBlank @Size(max = 100) String> preferredIndustries) {

    private static final int MIN_AGE = 16;

    @AssertTrue(message = "You must be at least 16 years old")
    public boolean isBirthYearAllowed() {
        return birthYear == null || birthYear <= Year.now().getValue() - MIN_AGE;
    }

    @AssertTrue(message = "Minimum salary must not exceed maximum salary")
    public boolean isSalaryRangeValid() {
        return Boolean.TRUE.equals(salaryNegotiable)
                || salaryMin == null
                || salaryMax == null
                || salaryMin <= salaryMax;
    }

    @AssertTrue(message = "Name must be 2 to 50 characters")
    public boolean isNameLengthValid() {
        return name == null || name.trim().length() >= 2 && name.trim().length() <= 50;
    }

    @AssertTrue(message = "Desired role must be 1 to 120 characters")
    public boolean isDesiredRoleLengthValid() {
        return desiredRole == null
                || desiredRole.trim().length() >= 1 && desiredRole.trim().length() <= 120;
    }
}
