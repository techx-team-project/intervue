package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.common.oauth.GoogleOAuthClientInterface;
import com.techx.intervue.common.oauth.OAuthProfile;
import com.techx.intervue.config.AppProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import com.techx.intervue.modules.helpers.CookieHelper;
import com.techx.intervue.modules.helpers.TokenHashUtil;
import com.techx.intervue.modules.user.enums.OAuthIntent;
import com.techx.intervue.modules.user.enums.OAuthProvider;
import com.techx.intervue.modules.user.requests.OAuthAuthorizeRequest;
import com.techx.intervue.modules.user.requests.OAuthCallbackRequest;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.resources.OAuthAuthorizeResult;
import com.techx.intervue.modules.user.services.interfaces.SocialAuthServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.SocialSignInServiceInterface;
import com.techx.intervue.services.interfaces.RateLimitServiceInterface;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SocialAuthService implements SocialAuthServiceInterface {

    private static final String KEY_PREFIX = "auth:oauth-state:";
    private static final Duration STATE_TTL = CookieHelper.OAUTH_STATE_MAX_AGE;
    private static final int RANDOM_BYTES = 32;
    private static final String FIELD_SEPARATOR = "|";
    private static final String CALLBACK_PATH = "/auth/callback/";
    private static final String AUTHORIZE_ROUTE = "oauth-authorize";
    private static final Duration AUTHORIZE_COOLDOWN = Duration.ofSeconds(1);
    private static final int AUTHORIZE_MAX_IN_WINDOW = 20;
    private static final Duration AUTHORIZE_WINDOW = Duration.ofMinutes(10);

    private final StringRedisTemplate redis;
    private final GoogleOAuthClientInterface googleOAuthClient;
    private final SocialSignInServiceInterface socialSignInService;
    private final AppProperties appProperties;
    private final RateLimitServiceInterface rateLimitService;
    private final TokenHashUtil tokenHashUtil;
    private final SecureRandom random = new SecureRandom();

    @Override
    public OAuthAuthorizeResult authorize(
            OAuthProvider provider, OAuthAuthorizeRequest request, String ip) {
        rateLimitService.enforce(
                AUTHORIZE_ROUTE,
                "ip:" + ip,
                AUTHORIZE_COOLDOWN,
                AUTHORIZE_MAX_IN_WINDOW,
                AUTHORIZE_WINDOW);
        boolean acceptTerms = Boolean.TRUE.equals(request.acceptTerms());
        if (request.intent() == OAuthIntent.REGISTER && !acceptTerms) {
            throw AppException.validation(
                    "acceptTerms", "Please accept the Terms of Service and Privacy Policy.");
        }

        String state = randomToken();
        String nonce = randomToken();
        String authorizationUrl = googleOAuthClient.authorizationUrl(state, redirectUri(provider));
        redis.opsForValue()
                .set(
                        key(state),
                        String.join(
                                FIELD_SEPARATOR,
                                provider.name(),
                                String.valueOf(acceptTerms),
                                tokenHashUtil.hash(nonce)),
                        STATE_TTL);
        return new OAuthAuthorizeResult(authorizationUrl, nonce);
    }

    @Override
    public AuthResult callback(
            OAuthProvider provider,
            OAuthCallbackRequest request,
            String nonce,
            String userAgent,
            String ip) {
        boolean acceptTerms = consumeState(provider, request.state(), nonce);
        OAuthProfile profile =
                googleOAuthClient.fetchProfile(request.code(), redirectUri(provider));
        return socialSignInService.signIn(provider, profile, acceptTerms, userAgent, ip);
    }

    private boolean consumeState(OAuthProvider provider, String state, String nonce) {
        String stored = redis.opsForValue().getAndDelete(key(state));
        if (stored == null || nonce == null || nonce.isBlank()) {
            throw new AppException(ErrorCode.OAUTH_STATE_INVALID);
        }
        String[] parts = stored.split("\\" + FIELD_SEPARATOR, 3);
        if (parts.length != 3
                || !provider.name().equals(parts[0])
                || !MessageDigest.isEqual(
                        parts[2].getBytes(StandardCharsets.UTF_8),
                        tokenHashUtil.hash(nonce).getBytes(StandardCharsets.UTF_8))) {
            throw new AppException(ErrorCode.OAUTH_STATE_INVALID);
        }
        return Boolean.parseBoolean(parts[1]);
    }

    private String randomToken() {
        byte[] bytes = new byte[RANDOM_BYTES];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String redirectUri(OAuthProvider provider) {
        return appProperties.frontendUrl() + CALLBACK_PATH + provider.getPathSegment();
    }

    private String key(String state) {
        return KEY_PREFIX + state;
    }
}
