package com.techx.intervue.modules.user.resources;

public record AuthResource(
        String accessToken, UserResource user, Boolean requiresTwoFactor, String tempToken) {
    public AuthResource(String accessToken, UserResource user) {
        this(accessToken, user, false, null);
    }

    public static AuthResource challenge(String tempToken) {
        return new AuthResource(null, null, true, tempToken);
    }
}
