package com.techx.intervue.modules.user.resources;

import java.time.Instant;

public record TwoFactorStatusResource(
        boolean enabled, Instant confirmedAt, int remainingBackupCodes) {}
