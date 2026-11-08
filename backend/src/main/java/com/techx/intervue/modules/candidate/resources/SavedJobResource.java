package com.techx.intervue.modules.candidate.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.job.resources.PublicJobSummaryResource;
import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record SavedJobResource(Long jobId, Instant savedAt, PublicJobSummaryResource job) {}
