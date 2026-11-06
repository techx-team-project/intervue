package com.techx.intervue.modules.ai.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record CvReviewQuotaResource(int usedToday, int remaining, int maxDaily, Instant resetAt) {}
