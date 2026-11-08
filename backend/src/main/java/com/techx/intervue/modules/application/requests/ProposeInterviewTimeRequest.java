package com.techx.intervue.modules.application.requests;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record ProposeInterviewTimeRequest(
        @NotNull @Future Instant proposedStartsAt, @Size(max = 500) String message) {}
