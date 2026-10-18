package com.techx.intervue.modules.user.requests;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Full name is required!")
                @Size(max = 50, message = "Full name must be at most 50 characters!")
                String name,
        @NotBlank(message = "Email is required!")
                @Email(message = "Email is invalid!")
                @Size(max = 100, message = "Email must be at most 100 characters!")
                String email,
        @NotBlank(message = "Password is required!") @StrongPassword String password,
        @NotBlank(message = "Please confirm your password!") String confirmPassword,
        @AssertTrue(message = "You must accept the Privacy Policy & Terms!") boolean acceptTerms) {}
