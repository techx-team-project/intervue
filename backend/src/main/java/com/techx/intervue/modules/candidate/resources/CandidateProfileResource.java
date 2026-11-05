package com.techx.intervue.modules.candidate.resources;

import com.techx.intervue.modules.candidate.enums.CareerLevel;
import com.techx.intervue.modules.candidate.enums.ContractType;
import com.techx.intervue.modules.candidate.enums.Gender;
import com.techx.intervue.modules.candidate.enums.JobSearchStatus;
import com.techx.intervue.modules.candidate.enums.WorkMode;
import java.math.BigDecimal;
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
        BigDecimal totalYoe,
        boolean salaryNegotiable,
        Long salaryMin,
        Long salaryMax,
        String currency,
        String salaryPeriod,
        WorkMode workMode,
        ContractType contractType,
        List<String> preferredLocations,
        List<String> preferredIndustries,
        List<CandidateExperienceResource> experiences,
        List<CandidateEducationResource> educations,
        List<CandidateProjectResource> projects,
        List<CandidateCertificationResource> certifications,
        List<CandidateLanguageResource> languages,
        List<CandidateSkillResource> skills,
        Instant updatedAt) {}
