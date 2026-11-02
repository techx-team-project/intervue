package com.techx.intervue.modules.user.requests;

import jakarta.validation.constraints.Size;

public record RevokeUserRoleRequest(
        @Size(max = 255, message = "Reason cannot exceed 255 characters") String reason) {}
