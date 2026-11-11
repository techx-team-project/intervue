package com.techx.intervue.modules.candidate.credits.requests;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record TopupCreditsRequest(
        @NotNull(message = "Amount is required")
                @Min(value = 1, message = "Minimum topup amount is 1 credit")
                @Max(value = 100, message = "Maximum topup amount is 100 credits")
                Integer amount) {}
