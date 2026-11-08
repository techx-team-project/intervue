package com.techx.intervue.modules.job.resources;

public record NearbyJobResource(
        PublicJobSummaryResource job,
        String address,
        double latitude,
        double longitude,
        double distanceKm) {}
