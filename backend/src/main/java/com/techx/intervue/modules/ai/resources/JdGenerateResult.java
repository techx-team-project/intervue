package com.techx.intervue.modules.ai.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record JdGenerateResult(
        String description,
        String requirements,
        String benefits,
        String model,
        String promptVersion,
        Instant generatedAt) {}
