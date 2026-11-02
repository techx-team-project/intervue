package com.techx.intervue.modules.user.requests;

import com.techx.intervue.modules.user.enums.RoleType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.Instant;

public record GrantUserRoleRequest(
        @NotNull(message = "Role is required") RoleType role,
        Instant expiresAt,
        @Size(max = 255, message = "Reason cannot exceed 255 characters") String reason) {}
