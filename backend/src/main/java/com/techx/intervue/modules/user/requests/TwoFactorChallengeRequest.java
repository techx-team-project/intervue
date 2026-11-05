package com.techx.intervue.modules.user.requests;

import jakarta.validation.constraints.NotBlank;

public record TwoFactorChallengeRequest(
        @NotBlank(message = "Session token is required") String tempToken,
        @NotBlank(message = "Verification code is required") String code) {}
