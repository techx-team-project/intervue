package com.techx.intervue.modules.ads.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReviewAdCreativeRequest(
        @NotBlank(message = "Rejection reason is required") @Size(max = 500)
                String rejectionReason) {}
