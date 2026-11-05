package com.techx.intervue.modules.user.requests;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequest(
        @NotBlank(message = "Current password is required!") String currentPassword,
        @NotBlank(message = "Password is required!") @StrongPassword String password,
        @NotBlank(message = "Please confirm your password!") String confirmPassword) {}
