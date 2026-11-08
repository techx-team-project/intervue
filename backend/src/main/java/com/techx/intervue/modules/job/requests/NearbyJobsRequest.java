package com.techx.intervue.modules.job.requests;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record NearbyJobsRequest(
        @NotNull @DecimalMin("-90") @DecimalMax("90") Double lat,
        @NotNull @DecimalMin("-180") @DecimalMax("180") Double lng,
        @Min(1) @Max(100) Integer radiusKm) {

    public static final int DEFAULT_RADIUS_KM = 10;

    public int effectiveRadiusKm() {
        return radiusKm == null ? DEFAULT_RADIUS_KM : radiusKm;
    }
}
