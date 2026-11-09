package com.techx.intervue.modules.candidate.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RejectIdentityVerificationRequest(@NotBlank @Size(max = 500) String reason) {}
