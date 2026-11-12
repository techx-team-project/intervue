package com.techx.intervue.modules.job.events;

public record JobReportThresholdReachedEvent(Long jobId, String jobTitle, long pendingReports) {}
