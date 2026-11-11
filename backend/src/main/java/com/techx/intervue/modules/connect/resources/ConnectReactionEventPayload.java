package com.techx.intervue.modules.connect.resources;

import java.util.List;

public record ConnectReactionEventPayload(
        Long connectionId, Long messageId, List<MessageReactionResource> reactions) {}
