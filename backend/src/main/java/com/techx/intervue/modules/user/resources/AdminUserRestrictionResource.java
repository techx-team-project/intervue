package com.techx.intervue.modules.user.resources;

import com.techx.intervue.modules.user.enums.RestrictionKind;
import java.time.Instant;

public record AdminUserRestrictionResource(
        RestrictionKind kind,
        String reason,
        String detail,
        Instant at,
        String byName,
        Instant expiresAt) {}
