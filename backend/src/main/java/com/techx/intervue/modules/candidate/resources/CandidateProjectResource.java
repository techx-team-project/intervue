package com.techx.intervue.modules.candidate.resources;

import java.time.LocalDate;
import java.util.List;
import lombok.Builder;

@Builder
public record CandidateProjectResource(
        Long id,
        String name,
        String role,
        LocalDate startDate,
        LocalDate endDate,
        boolean current,
        String description,
        String highlights,
        String githubUrl,
        String demoUrl,
        List<String> technologies) {}
