package com.techx.intervue.modules.connect.resources;

import com.techx.intervue.modules.connect.enums.ConnectActorType;
import com.techx.intervue.modules.connect.enums.ConnectionStatus;

public record ConnectStatusEventPayload(
        Long connectionId, ConnectionStatus status, ConnectActorType blockedByActorType) {}
