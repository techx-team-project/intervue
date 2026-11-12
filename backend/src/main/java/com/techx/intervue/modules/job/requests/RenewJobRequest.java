package com.techx.intervue.modules.job.requests;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record RenewJobRequest(@NotNull @FutureOrPresent LocalDate deadline) {

    @AssertTrue
    public boolean isDeadlineWithinLimit() {
        return JobLimits.isDeadlineWithinLimit(deadline);
    }
}
