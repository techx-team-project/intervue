package com.techx.intervue.modules.connect.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectionStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ConversationSummaryResource(
        Long id,
        String publicId,
        ConnectionStatus status,
        ConnectActorType blockedByActorType,
        Long companyId,
        String companyName,
        Long candidateId,
        String candidateName,
        Instant invitedAt,
        Instant respondedAt,
        long unreadCount,
        Instant lastMessageAt,
        String lastMessagePreview,
        Long peerLastReadMessageId,
        Instant peerLastReadAt) {}
