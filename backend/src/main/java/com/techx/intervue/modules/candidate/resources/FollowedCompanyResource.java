package com.techx.intervue.modules.candidate.resources;

import com.techx.intervue.modules.company.resources.PublicCompanyResource;
import java.time.Instant;

public record FollowedCompanyResource(
        Long companyId, Instant followedAt, PublicCompanyResource company) {}
