package com.techx.intervue.modules.candidate.resources;

import com.techx.intervue.modules.candidate.enums.CareerLevel;
import com.techx.intervue.modules.candidate.enums.ContractType;
import com.techx.intervue.modules.candidate.enums.Gender;
import com.techx.intervue.modules.candidate.enums.JobSearchStatus;
import com.techx.intervue.modules.candidate.enums.WorkMode;
import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
public record CandidateProfileResource(
        Long userId,
        String name,
        String email,
        String contactEmail,
        String phone,
        boolean phoneVerified,
        String address,
        String avatarUrl,
        String coverUrl,
        String headline,
        String bio,
        Gender gender,
        Integer birthYear,
        boolean showPersonalDetails,
        boolean searchableByRecruiters,
        JobSearchStatus jobSearchStatus,
        String githubUrl,
        String linkedinUrl,
        String portfolioUrl,
        String desiredRole,
        CareerLevel desiredLevel,
        boolean salaryNegotiable,
        Long salaryMin,
        Long salaryMax,
        WorkMode workMode,
        ContractType contractType,
        List<String> preferredLocations,
        List<String> preferredIndustries,
        Instant updatedAt) {}
