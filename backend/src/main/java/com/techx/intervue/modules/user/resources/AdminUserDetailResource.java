package com.techx.intervue.modules.user.resources;

import com.techx.intervue.modules.user.enums.UserStatus;
import java.time.Instant;
import java.util.List;
import lombok.Builder;

@Builder
public record AdminUserDetailResource(
        Long id,
        String name,
        String email,
        String phone,
        String image,
        String address,
        UserStatus status,
        Instant emailVerifiedAt,
        Instant termsAcceptedAt,
        List<AdminUserRoleGrantResource> roles,
        long activeSessionCount,
        boolean hasTokenReuseIncident,
        Instant createdAt,
        Instant updatedAt,
        Instant lastSignInAt,
        AdminUserRestrictionResource restriction) {}
