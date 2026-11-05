package com.techx.intervue.modules.user.resources;

public record AdminQueueCountsResource(
        long pendingVerifications, long totalUsers, long totalRecruiters, long activeCompanies) {}
