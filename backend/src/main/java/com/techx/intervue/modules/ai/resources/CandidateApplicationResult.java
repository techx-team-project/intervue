package com.techx.intervue.modules.ai.resources;

public record CandidateApplicationResult(
        String applicationId,
        String jobTitle,
        String companyName,
        String status,
        String appliedAt,
        String detailUrl) {}
