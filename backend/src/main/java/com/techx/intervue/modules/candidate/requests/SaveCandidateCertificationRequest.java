package com.techx.intervue.modules.candidate.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record SaveCandidateCertificationRequest(
        @NotBlank @Size(max = 150) String name,
        @NotBlank @Size(max = 150) String issuer,
        LocalDate issueDate,
        @Size(max = 100) String credentialId,
        @Size(max = 255)
                @Pattern(regexp = "^$|^https?://.+", message = "Must be an http or https URL")
                String credentialUrl) {}
