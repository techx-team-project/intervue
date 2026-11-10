package com.techx.intervue.modules.connect.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.connect.enums.ConnectionStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ConversationSummaryResource(
        Long id,
        ConnectionStatus status,
        Long companyId,
        String companyName,
        Long candidateId,
        String candidateName,
        Instant invitedAt,
        Instant respondedAt) {}
