package com.techx.intervue.modules.recruiter.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.recruiter.enums.RecruiterStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record RecruiterResource(
        Long id,
        String email,
        String name,
        String phone,
        RecruiterStatus status,
        boolean emailVerified,
        Instant createdAt) {}
