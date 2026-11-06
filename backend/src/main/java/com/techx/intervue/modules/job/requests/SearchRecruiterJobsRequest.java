package com.techx.intervue.modules.job.requests;

import com.techx.intervue.modules.job.enums.JobStatus;
import jakarta.validation.constraints.Size;

public record SearchRecruiterJobsRequest(JobStatus status, @Size(max = 100) String q) {}
