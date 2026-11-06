package com.techx.intervue.modules.user.requests;

import jakarta.validation.constraints.NotBlank;

public record PasswordVerifyRequest(@NotBlank(message = "Password is required") String password) {}
