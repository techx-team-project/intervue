package com.techx.intervue.modules.user.resources;

public record AdminAuthResource(
        String accessToken,
        AdminProfileResource admin,
        Boolean requiresTwoFactor,
        String tempToken) {
    public AdminAuthResource(String accessToken, AdminProfileResource admin) {
        this(accessToken, admin, false, null);
    }

    public static AdminAuthResource challenge(String tempToken) {
        return new AdminAuthResource(null, null, true, tempToken);
    }
}
