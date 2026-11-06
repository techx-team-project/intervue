package com.techx.intervue.modules.notification.events;

import com.techx.intervue.modules.notification.enums.BroadcastAudience;
import java.util.List;

public record BroadcastDispatchRequestedEvent(
        Long broadcastId, BroadcastAudience audience, List<Long> recipientIds) {}
