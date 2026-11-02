package com.techx.intervue.modules.user.requests;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record RestrictUserRequest(
        @NotBlank @Size(max = 255) String reason,
        @Size(max = 500) String detail,
        boolean notifyUser,
        @Future Instant expiresAt) {}
