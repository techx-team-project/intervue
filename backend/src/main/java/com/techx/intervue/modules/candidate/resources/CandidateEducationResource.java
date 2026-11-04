package com.techx.intervue.modules.candidate.resources;

import lombok.Builder;

@Builder
public record CandidateEducationResource(
        Long id,
        String school,
        String degree,
        String major,
        int startYear,
        Integer endYear,
        String gpa,
        String achievements) {}
