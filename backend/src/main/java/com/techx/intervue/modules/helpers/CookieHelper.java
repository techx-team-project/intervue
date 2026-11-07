package com.techx.intervue.modules.helpers;

import java.time.Duration;
import org.springframework.http.ResponseCookie;

public class CookieHelper {
    public static final String REFRESH_TOKEN_COOKIE = "refresh_token";
    public static final String RECRUITER_REFRESH_TOKEN_COOKIE = "recruiter_refresh_token";
    public static final String ADMIN_REFRESH_TOKEN_COOKIE = "admin_refresh_token";

    public static final String OAUTH_STATE_NONCE_COOKIE = "oauth_state_nonce";
    public static final String OAUTH_STATE_NONCE_PATH = "/api/v1/auth/oauth";
    public static final Duration OAUTH_STATE_MAX_AGE = Duration.ofMinutes(5);

    public static ResponseCookie buildOAuthStateNonceCookie(String nonce) {
        return buildCookie(
                OAUTH_STATE_NONCE_COOKIE, nonce, OAUTH_STATE_NONCE_PATH, OAUTH_STATE_MAX_AGE);
    }

    public static ResponseCookie clearOAuthStateNonceCookie() {
        return buildCookie(OAUTH_STATE_NONCE_COOKIE, "", OAUTH_STATE_NONCE_PATH, Duration.ZERO);
    }

    public static ResponseCookie buildRefreshTokenCookie(String token, Duration maxAge) {
        return buildCookie(REFRESH_TOKEN_COOKIE, token, "/", maxAge);
    }

    public static ResponseCookie clearRefreshTokenCookie() {
        return buildRefreshTokenCookie("", Duration.ZERO);
    }

    public static ResponseCookie clearLegacyRefreshTokenCookie() {
        return buildCookie(REFRESH_TOKEN_COOKIE, "", "/api/v1", Duration.ZERO);
    }

    public static ResponseCookie buildRecruiterRefreshTokenCookie(String token, Duration maxAge) {
        return buildCookie(RECRUITER_REFRESH_TOKEN_COOKIE, token, "/", maxAge);
    }

    public static ResponseCookie clearRecruiterRefreshTokenCookie() {
        return buildRecruiterRefreshTokenCookie("", Duration.ZERO);
    }

    public static ResponseCookie clearLegacyRecruiterRefreshTokenCookie() {
        return buildCookie(RECRUITER_REFRESH_TOKEN_COOKIE, "", "/api/v1/recruiter", Duration.ZERO);
    }

    public static ResponseCookie buildAdminRefreshTokenCookie(String token, Duration maxAge) {
        return buildCookie(ADMIN_REFRESH_TOKEN_COOKIE, token, "/", maxAge);
    }

    public static ResponseCookie clearAdminRefreshTokenCookie() {
        return buildAdminRefreshTokenCookie("", Duration.ZERO);
    }

    public static ResponseCookie clearLegacyAdminRefreshTokenCookie() {
        return buildCookie(ADMIN_REFRESH_TOKEN_COOKIE, "", "/api/v1/admin", Duration.ZERO);
    }

    public static final String RECRUITER_DEVICE_TRUST_COOKIE = "recruiter_device_trust";
    public static final Duration DEVICE_TRUST_MAX_AGE = Duration.ofDays(30);

    public static ResponseCookie buildRecruiterDeviceTrustCookie(String token, Duration maxAge) {
        return buildCookie(RECRUITER_DEVICE_TRUST_COOKIE, token, "/", maxAge);
    }

    public static ResponseCookie clearRecruiterDeviceTrustCookie() {
        return buildRecruiterDeviceTrustCookie("", Duration.ZERO);
    }

    private static ResponseCookie buildCookie(
            String name, String token, String path, Duration maxAge) {
        return ResponseCookie.from(name, token)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .path(path)
                .maxAge(maxAge)
                .build();
    }
}
