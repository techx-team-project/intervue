package com.techx.intervue.modules.connect.resources;

import lombok.Builder;

@Builder
public record EligibleCandidateResource(Long candidateId, String fullName, String email) {}
