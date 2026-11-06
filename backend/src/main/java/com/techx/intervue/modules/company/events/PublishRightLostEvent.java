package com.techx.intervue.modules.company.events;

import com.techx.intervue.modules.company.enums.PublishRightLossCause;
import java.time.Instant;
import lombok.Builder;

@Builder
public record PublishRightLostEvent(
        Long userId,
        Long companyId,
        String companyName,
        PublishRightLossCause cause,
        Instant occurredAt) {}
