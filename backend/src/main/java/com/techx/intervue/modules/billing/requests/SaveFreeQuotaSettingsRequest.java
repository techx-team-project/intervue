package com.techx.intervue.modules.billing.requests;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SaveFreeQuotaSettingsRequest(
        @NotNull @Min(0) @Max(10_000) Integer aiResumeMatchFreePerMonth,
        @NotNull @Min(0) @Max(10_000) Integer aiJdGenerateFreePerMonth,
        @NotNull @Min(0) @Max(1_000) Integer cvReviewFreePerDay,
        @NotNull @Min(0) @Max(1_000) Integer candidateStarterCredits,
        @NotNull @Min(0) @Max(10_000) Integer connectDailyInviteLimit,
        @NotNull @Min(0) @Max(100) Integer companyFreePhotoLimit,
        @NotNull Boolean requireJobSlot) {}
