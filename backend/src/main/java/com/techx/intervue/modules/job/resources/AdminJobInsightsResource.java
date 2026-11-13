package com.techx.intervue.modules.job.resources;

import java.time.LocalDate;
import java.util.List;

public record AdminJobInsightsResource(
        int days,
        long pendingReview,
        long submitted,
        long approved,
        long rejected,
        Double approvalRate,
        Double avgReviewHours,
        List<DailyCount> publishedPerDay,
        List<ReportedJob> mostReported) {

    public record DailyCount(LocalDate date, long count) {}

    public record ReportedJob(Long jobId, String title, String companyName, long pendingReports) {}
}
