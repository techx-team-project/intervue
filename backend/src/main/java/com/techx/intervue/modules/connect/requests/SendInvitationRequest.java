package com.techx.intervue.modules.connect.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SendInvitationRequest(
        @NotNull Long candidateId, @NotBlank @Size(max = 1000) String message) {}
