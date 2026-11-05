package com.techx.intervue.modules.user.resources;

public record AdminAuthResult(
        String accessToken,
        String refreshToken,
        AdminProfileResource admin,
        Boolean requiresTwoFactor,
        String tempToken) {
    public AdminAuthResult(String accessToken, String refreshToken, AdminProfileResource admin) {
        this(accessToken, refreshToken, admin, false, null);
    }

    public static AdminAuthResult challenge(String tempToken) {
        return new AdminAuthResult(null, null, null, true, tempToken);
    }
}
