package com.techx.intervue.common.oauth;

public record OAuthProfile(
        String subject, String email, boolean emailVerified, String name, String hostedDomain) {}
