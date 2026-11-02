package com.techx.intervue.modules.user.requests;

import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.enums.UserStatus;
import jakarta.validation.constraints.Size;

public record SearchUsersRequest(
        @Size(max = 100) String q, RoleType role, UserStatus status, Boolean emailVerified) {}
