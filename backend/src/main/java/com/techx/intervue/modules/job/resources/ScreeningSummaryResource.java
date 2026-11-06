package com.techx.intervue.modules.job.resources;

public record ScreeningSummaryResource(
        int questionCount, int requiredCount, int estimatedMinutes) {}
