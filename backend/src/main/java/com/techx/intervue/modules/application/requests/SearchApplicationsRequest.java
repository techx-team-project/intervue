package com.techx.intervue.modules.application.requests;

import com.techx.intervue.modules.application.enums.ApplicationStatus;

public record SearchApplicationsRequest(ApplicationStatus status, Long jobId) {}
