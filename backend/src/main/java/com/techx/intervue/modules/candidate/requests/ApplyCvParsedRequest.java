package com.techx.intervue.modules.candidate.requests;

import com.techx.intervue.modules.candidate.resources.ParsedProfileData;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record ApplyCvParsedRequest(
        boolean applyHeadline,
        boolean applyDesiredRole,
        boolean applyBio,
        boolean applyTotalYoe,
        boolean applySkills,
        boolean applyExperiences,
        boolean applyEducations,
        boolean applyCertifications,
        boolean applyLanguages,
        @NotNull ParsedProfileData parsedData) {}
