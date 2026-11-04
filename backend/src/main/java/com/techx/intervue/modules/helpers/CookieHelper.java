package com.techx.intervue.modules.helpers;

import java.time.Duration;
import org.springframework.http.ResponseCookie;

public class CookieHelper {
    public static final String REFRESH_TOKEN_COOKIE = "refresh_token";
    public static final String RECRUITER_REFRESH_TOKEN_COOKIE = "recruiter_refresh_token";

    public static ResponseCookie buildRefreshTokenCookie(String token, Duration maxAge) {
        return buildCookie(REFRESH_TOKEN_COOKIE, token, "/", maxAge);
    }

    public static ResponseCookie clearRefreshTokenCookie() {
        return buildRefreshTokenCookie("", Duration.ZERO);
    }

    public static ResponseCookie buildRecruiterRefreshTokenCookie(String token, Duration maxAge) {
        return buildCookie(RECRUITER_REFRESH_TOKEN_COOKIE, token, "/", maxAge);
    }

    public static ResponseCookie clearRecruiterRefreshTokenCookie() {
        return buildRecruiterRefreshTokenCookie("", Duration.ZERO);
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
