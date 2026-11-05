package com.techx.intervue.modules.user.resources;

public record AuthResult(
        String accessToken,
        String refreshToken,
        UserResource user,
        Boolean requiresTwoFactor,
        String tempToken) {
    public AuthResult(String accessToken, String refreshToken, UserResource user) {
        this(accessToken, refreshToken, user, false, null);
    }

    public static AuthResult challenge(String tempToken) {
        return new AuthResult(null, null, null, true, tempToken);
    }
}
