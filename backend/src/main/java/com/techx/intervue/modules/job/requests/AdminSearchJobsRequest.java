package com.techx.intervue.modules.job.requests;

import com.techx.intervue.modules.job.enums.JobStatus;
import jakarta.validation.constraints.Size;

public record AdminSearchJobsRequest(@Size(max = 100) String q, JobStatus status, Long companyId) {}
