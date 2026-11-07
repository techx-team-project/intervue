package com.techx.intervue.modules.recruiter.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.recruiter.enums.RecruiterGender;
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
        RecruiterGender gender,
        String companyName,
        String province,
        String districtWard,
        RecruiterStatus status,
        boolean emailVerified,
        boolean phoneVerified,
        boolean hasPassword,
        Instant deleteRequestedAt,
        Instant createdAt) {}
