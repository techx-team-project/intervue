package com.techx.intervue.modules.connect.resources;

import java.time.Instant;
import lombok.Builder;

@Builder
public record InvitationResource(
        Long id, Long companyId, String companyName, String openingMessage, Instant invitedAt) {}
