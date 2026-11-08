package com.techx.intervue.modules.application.requests;

import jakarta.validation.constraints.Size;

public record InterviewReasonRequest(@Size(max = 500) String reason) {}
