package com.techx.intervue.modules.job.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SimilarJobsRequest(
        @NotBlank @Size(max = 150) String title, @Size(max = 100) String city, Long excludeId) {}
