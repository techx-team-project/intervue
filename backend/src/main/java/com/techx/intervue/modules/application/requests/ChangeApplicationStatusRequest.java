package com.techx.intervue.modules.application.requests;

import com.techx.intervue.modules.application.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ChangeApplicationStatusRequest(
        @NotNull ApplicationStatus status, @Size(max = 500) String note) {}
