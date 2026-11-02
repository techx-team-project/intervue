package com.techx.intervue.modules.user.requests;

import jakarta.validation.constraints.Size;

public record LiftRestrictionRequest(@Size(max = 255) String reason) {}
