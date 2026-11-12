package com.techx.intervue.modules.application.requests;

import com.techx.intervue.common.validation.DateWindows;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record ProposeInterviewTimeRequest(
        @NotNull @Future Instant proposedStartsAt, @Size(max = 500) String message) {

    @AssertTrue
    public boolean isStartWithinWindow() {
        return DateWindows.isWithinFutureWindow(proposedStartsAt, DateWindows.INTERVIEW_MAX_DAYS);
    }
}
