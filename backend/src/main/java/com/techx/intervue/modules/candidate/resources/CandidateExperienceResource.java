package com.techx.intervue.modules.candidate.resources;

import java.time.LocalDate;
import java.util.List;
import lombok.Builder;

@Builder
public record CandidateExperienceResource(
        Long id,
        String title,
        String companyName,
        String location,
        LocalDate startDate,
        LocalDate endDate,
        boolean current,
        String description,
        String achievements,
        List<String> skills) {}
