package com.techx.intervue.modules.user.requests;

import jakarta.validation.constraints.NotBlank;

public record TwoFactorVerifyRequest(
        @NotBlank(message = "Verification code is required") String code) {}
