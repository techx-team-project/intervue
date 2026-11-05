package com.techx.intervue.modules.user.requests;

import jakarta.validation.constraints.NotBlank;

public record TwoFactorSetupInitiateRequest(
        @NotBlank(message = "Session token is required") String tempToken) {}
