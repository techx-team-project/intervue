package com.techx.intervue.modules.user.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record AdminUserActivityResource(
        Long id, String kind, String summary, String actorName, String reason, Instant at) {}
