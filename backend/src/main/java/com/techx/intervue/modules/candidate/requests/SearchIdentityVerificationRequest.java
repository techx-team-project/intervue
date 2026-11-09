package com.techx.intervue.modules.candidate.requests;

import com.techx.intervue.modules.candidate.enums.IdentityVerificationStatus;
import jakarta.validation.constraints.Size;

public record SearchIdentityVerificationRequest(
        IdentityVerificationStatus status, @Size(max = 100) String q) {}
