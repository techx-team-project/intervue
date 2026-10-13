package com.techx.intervue.modules.user.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "Token is required!") @Size(max = 128, message = "Token is invalid!")
                String token,
        @NotBlank(message = "Password is required!") @StrongPassword String password,
        @NotBlank(message = "Please confirm your password!") String confirmPassword) {}
