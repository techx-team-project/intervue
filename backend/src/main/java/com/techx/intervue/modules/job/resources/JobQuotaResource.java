package com.techx.intervue.modules.job.resources;

public record JobQuotaResource(
        int slotsRemaining,
        boolean slotRequired,
        int freeLimit,
        int freeMaxDays,
        long freePostsUsed) {}
