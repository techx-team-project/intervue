package com.techx.intervue.modules.connect.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record ConnectMuteStatusResource(boolean muted, Instant expiresAt, String reason) {}
