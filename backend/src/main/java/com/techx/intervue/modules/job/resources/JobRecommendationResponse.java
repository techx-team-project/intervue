package com.techx.intervue.modules.job.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record JobRecommendationResponse(
        List<JobRecommendationItemResource> items,
        boolean fallback,
        String fallbackReason,
        String nudgeMessage,
        String nudgeActionUrl) {}
