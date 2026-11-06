package com.techx.intervue.modules.notification.requests;

import com.techx.intervue.modules.notification.enums.BroadcastAudience;
import com.techx.intervue.modules.notification.enums.BroadcastStatus;

public record SearchBroadcastRequest(
        BroadcastStatus status, BroadcastAudience audience, String q) {}
