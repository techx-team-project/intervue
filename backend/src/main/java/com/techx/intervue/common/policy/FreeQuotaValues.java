package com.techx.intervue.common.policy;

public record FreeQuotaValues(
        int aiResumeMatchFreePerMonth,
        int aiJdGenerateFreePerMonth,
        int cvReviewFreePerDay,
        int candidateStarterCredits,
        int connectDailyInviteLimit,
        int companyFreePhotoLimit,
        boolean requireJobSlot,
        int jobFreePostLimit,
        int jobFreeMaxDays,
        int jobReviewFirstCount) {

    public static final FreeQuotaValues DEFAULTS =
            new FreeQuotaValues(30, 10, 3, 5, 100, 3, false, 3, 60, 3);
}
