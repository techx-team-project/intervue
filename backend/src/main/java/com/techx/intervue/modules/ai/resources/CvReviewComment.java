package com.techx.intervue.modules.ai.resources;

import lombok.Builder;

@Builder
public record CvReviewComment(String section, String quote, String problem, String fix) {}
