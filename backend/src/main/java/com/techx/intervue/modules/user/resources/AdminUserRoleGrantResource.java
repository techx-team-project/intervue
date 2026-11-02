package com.techx.intervue.modules.user.resources;

import com.techx.intervue.modules.user.enums.RoleType;
import java.time.Instant;

public record AdminUserRoleGrantResource(
        RoleType role, Instant grantedAt, String grantedByName, Instant expiresAt) {}
