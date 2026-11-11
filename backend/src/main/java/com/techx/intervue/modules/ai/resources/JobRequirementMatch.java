package com.techx.intervue.modules.ai.resources;

import lombok.Builder;

@Builder
public record JobRequirementMatch(
        String requirement,
        String status,
        String cvEvidence,
        String explanation,
        Integer fitScore,
        String improvementTip) {}
