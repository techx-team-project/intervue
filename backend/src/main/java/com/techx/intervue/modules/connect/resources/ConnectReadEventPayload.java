package com.techx.intervue.modules.connect.resources;

import com.techx.intervue.modules.connect.enums.ConnectActorType;
import java.time.Instant;

public record ConnectReadEventPayload(
        Long connectionId,
        ConnectActorType readerType,
        Long readerId,
        Long lastReadMessageId,
        Instant lastReadAt) {}
