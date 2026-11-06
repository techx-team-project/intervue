package com.techx.intervue.modules.job.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record HideJobRequest(@NotBlank @Size(max = 500) String reason) {}
