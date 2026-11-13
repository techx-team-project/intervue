package com.techx.intervue.modules.billing.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record FreeQuotaSettingsResource(
        int aiResumeMatchFreePerMonth,
        int aiJdGenerateFreePerMonth,
        int cvReviewFreePerDay,
        int candidateStarterCredits,
        int connectDailyInviteLimit,
        int companyFreePhotoLimit,
        boolean requireJobSlot,
        int jobFreePostLimit,
        int jobFreeMaxDays,
        int jobReviewFirstCount,
        int candidateDailyApplicationLimit,
        Instant updatedAt) {}
