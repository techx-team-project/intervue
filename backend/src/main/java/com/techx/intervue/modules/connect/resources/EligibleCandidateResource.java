package com.techx.intervue.modules.connect.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record EligibleCandidateResource(
        Long candidateId, String fullName, String email, String jobTitle, Instant submittedAt) {}
