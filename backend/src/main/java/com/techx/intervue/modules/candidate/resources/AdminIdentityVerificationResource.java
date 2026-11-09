package com.techx.intervue.modules.candidate.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.candidate.enums.IdentityVerificationStatus;
import java.time.Instant;
import java.time.LocalDate;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AdminIdentityVerificationResource(
        Long id,
        Long userId,
        String userEmail,
        String fullName,
        LocalDate dateOfBirth,
        String idNumberLast4,
        IdentityVerificationStatus status,
        boolean idNumberUsedByAnotherAccount,
        String rejectReason,
        int rejectionCount,
        int attemptLimit,
        Instant submittedAt,
        Instant reviewedAt) {}
