package com.techx.intervue.modules.user.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangeEmailRequest(
        @NotBlank(message = "Email is required!")
                @Email(message = "Email is invalid!")
                @Size(max = 100, message = "Email must be at most 100 characters!")
                String newEmail,
        @NotBlank(message = "Current password is required!") String currentPassword) {}
