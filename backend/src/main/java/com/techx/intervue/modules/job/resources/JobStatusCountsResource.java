package com.techx.intervue.modules.job.resources;

import com.techx.intervue.modules.job.enums.JobStatus;
import java.util.Map;

public record JobStatusCountsResource(long total, Map<JobStatus, Long> byStatus) {}
