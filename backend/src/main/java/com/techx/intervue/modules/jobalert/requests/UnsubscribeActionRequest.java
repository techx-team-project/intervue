package com.techx.intervue.modules.jobalert.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UnsubscribeActionRequest(
        @NotBlank String token,
        @NotBlank @Pattern(regexp = "PAUSE|DELETE", message = "Action must be PAUSE or DELETE")
                String action) {}
