package com.techx.intervue.modules.candidate.resources;

import java.time.LocalDate;
import lombok.Builder;

@Builder
public record CandidateCertificationResource(
        Long id,
        String name,
        String issuer,
        LocalDate issueDate,
        String credentialId,
        String credentialUrl,
        String imageUrl) {}
