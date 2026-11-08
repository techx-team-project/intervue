package com.techx.intervue.modules.application.requests;

import com.techx.intervue.modules.application.enums.ApplicationStatus;
import jakarta.validation.constraints.Size;

public record SearchRecruiterApplicationsRequest(
        Long jobId, ApplicationStatus status, @Size(max = 100) String q) {}
