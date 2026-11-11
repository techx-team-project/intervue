package com.techx.intervue.modules.connect.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record ConnectRulesAckResource(boolean acknowledged, Instant acknowledgedAt) {}
