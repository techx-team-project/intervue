package com.techx.intervue.modules.user.resources;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.enums.UserStatus;
import java.time.Instant;
import java.util.Set;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserResource(
        Long id,
        String email,
        String name,
        String phone,
        UserStatus status,
        boolean emailVerified,
        Set<RoleType> roles,
        Instant createdAt) {}
