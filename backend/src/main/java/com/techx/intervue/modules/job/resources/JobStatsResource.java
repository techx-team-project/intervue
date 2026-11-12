package com.techx.intervue.modules.job.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDate;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record JobStatsResource(
        long totalViews, long totalApplications, Double conversionRate, List<DailyStat> daily) {

    public record DailyStat(LocalDate date, long views, long applications) {}
}
