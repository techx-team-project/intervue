package com.techx.intervue.modules.connect.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectionStatus;
import java.time.Instant;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record ConnectStatusEventPayload(
        Long connectionId,
        ConnectionStatus status,
        ConnectActorType blockedByActorType,
        Instant invitedAt,
        Instant respondedAt,
        Integer inviteCount,
        Integer maxInvites,
        Instant reinviteAvailableAt) {

    public ConnectStatusEventPayload(
            Long connectionId, ConnectionStatus status, ConnectActorType blockedByActorType) {
        this(connectionId, status, blockedByActorType, null, null, null, null, null);
    }
}
