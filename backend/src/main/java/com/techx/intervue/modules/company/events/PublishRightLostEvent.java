package com.techx.intervue.modules.company.events;

import com.techx.intervue.modules.company.enums.PublishRightLossCause;
import com.techx.intervue.modules.company.enums.PublishRightLossScope;
import java.time.Instant;
import lombok.Builder;

@Builder
public record PublishRightLostEvent(
        Long userId,
        Long companyId,
        PublishRightLossScope scope,
        PublishRightLossCause cause,
        Long reassignToUserId,
        Instant occurredAt) {}
