package com.techx.intervue.modules.connect.events;

import com.techx.intervue.modules.connect.enums.ConnectActorType;
import java.util.List;

public record ConnectSseDispatchEvent(
        List<Recipient> recipients, String eventName, Object payload) {

    public record Recipient(ConnectActorType actorType, Long actorId) {}
}
