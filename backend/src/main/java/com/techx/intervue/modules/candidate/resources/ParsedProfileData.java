package com.techx.intervue.modules.candidate.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.candidate.requests.SaveCandidateCertificationRequest;
import com.techx.intervue.modules.candidate.requests.SaveCandidateEducationRequest;
import com.techx.intervue.modules.candidate.requests.SaveCandidateExperienceRequest;
import com.techx.intervue.modules.candidate.requests.SaveCandidateLanguageRequest;
import com.techx.intervue.modules.candidate.requests.SaveCandidateSkillRequest;
import java.math.BigDecimal;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ParsedProfileData(
        String headline,
        String desiredRole,
        String bio,
        BigDecimal totalYoe,
        List<SaveCandidateSkillRequest> skills,
        List<SaveCandidateExperienceRequest> experiences,
        List<SaveCandidateEducationRequest> educations,
        List<SaveCandidateCertificationRequest> certifications,
        List<SaveCandidateLanguageRequest> languages) {}
