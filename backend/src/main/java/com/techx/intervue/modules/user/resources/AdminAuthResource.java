package com.techx.intervue.modules.user.resources;

public record AdminAuthResource(
        String accessToken,
        AdminProfileResource admin,
        Boolean requiresTwoFactor,
        Boolean requiresTwoFactorSetup,
        String tempToken) {
    public AdminAuthResource(String accessToken, AdminProfileResource admin) {
        this(accessToken, admin, false, false, null);
    }

    public static AdminAuthResource challenge(String tempToken) {
        return new AdminAuthResource(null, null, true, false, tempToken);
    }

    public static AdminAuthResource setupRequired(String tempToken) {
        return new AdminAuthResource(null, null, false, true, tempToken);
    }
}
