package com.techx.intervue.modules.user.resources;

import com.techx.intervue.modules.user.enums.UserStatus;
import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
public record AdminUserListResource(
        Long id,
        String name,
        String email,
        String phone,
        String image,
        UserStatus status,
        Instant emailVerifiedAt,
        List<AdminUserRoleGrantResource> roles,
        long activeSessionCount,
        boolean hasTokenReuseIncident,
        Instant createdAt,
        Instant lastSignInAt,
        AdminUserRestrictionResource restriction) {}
