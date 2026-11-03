package com.techx.intervue.modules.company.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RevokeMembershipRequest(@NotBlank @Size(max = 255) String reason) {}
