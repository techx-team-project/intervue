package com.techx.intervue.modules.notification.resources;

import com.techx.intervue.modules.notification.enums.BroadcastAudience;

public record AudiencePreviewResource(BroadcastAudience audience, long estimatedRecipients) {}
