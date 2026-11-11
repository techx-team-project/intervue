package com.techx.intervue.modules.connect.resources;

import com.techx.intervue.modules.connect.enums.ConnectActorType;

public record ConnectTypingEventPayload(
        Long connectionId,
        ConnectActorType actorType,
        Long actorId,
        String actorName,
        boolean typing) {}
