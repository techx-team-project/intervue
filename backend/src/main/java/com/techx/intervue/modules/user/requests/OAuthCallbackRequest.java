package com.techx.intervue.modules.user.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OAuthCallbackRequest(
        @NotBlank(message = "Authorization code is required!")
                @Size(max = 2048, message = "Authorization code is too long!")
                String code,
        @NotBlank(message = "State is required!") @Size(max = 128, message = "State is too long!")
                String state) {}
