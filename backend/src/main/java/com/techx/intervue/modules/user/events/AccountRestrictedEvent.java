package com.techx.intervue.modules.user.events;

import java.time.Instant;

public record AccountRestrictedEvent(
        Long userId, String email, String name, String reason, Instant expiresAt) {}
