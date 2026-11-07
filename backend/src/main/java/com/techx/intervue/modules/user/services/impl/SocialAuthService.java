package com.techx.intervue.modules.user.services.impl;

import com.techx.intervue.common.oauth.GoogleOAuthClientInterface;
import com.techx.intervue.common.oauth.OAuthProfile;
import com.techx.intervue.common.oauth.OAuthStateStoreInterface;
import com.techx.intervue.common.oauth.OAuthStateStoreInterface.IssuedAuthorization;
import com.techx.intervue.config.AppProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.modules.user.enums.OAuthIntent;
import com.techx.intervue.modules.user.enums.OAuthProvider;
import com.techx.intervue.modules.user.requests.OAuthAuthorizeRequest;
import com.techx.intervue.modules.user.requests.OAuthCallbackRequest;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.resources.OAuthAuthorizeResult;
import com.techx.intervue.modules.user.services.interfaces.SocialAuthServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.SocialSignInServiceInterface;
import com.techx.intervue.services.interfaces.RateLimitServiceInterface;
import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SocialAuthService implements SocialAuthServiceInterface {

    private static final String KEY_PREFIX = "auth:oauth-state:";
    private static final String CALLBACK_PATH = "/auth/callback/";
    private static final String AUTHORIZE_ROUTE = "oauth-authorize";
    private static final Duration AUTHORIZE_COOLDOWN = Duration.ofSeconds(1);
    private static final int AUTHORIZE_MAX_IN_WINDOW = 20;
    private static final Duration AUTHORIZE_WINDOW = Duration.ofMinutes(10);

    private final OAuthStateStoreInterface stateStore;
    private final GoogleOAuthClientInterface googleOAuthClient;
    private final SocialSignInServiceInterface socialSignInService;
    private final AppProperties appProperties;
    private final RateLimitServiceInterface rateLimitService;

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

        IssuedAuthorization issued =
                stateStore.issue(
                        KEY_PREFIX,
                        provider.name(),
                        acceptTerms,
                        state -> googleOAuthClient.authorizationUrl(state, redirectUri(provider)));
        return new OAuthAuthorizeResult(issued.authorizationUrl(), issued.nonce());
    }

    @Override
    public AuthResult callback(
            OAuthProvider provider,
            OAuthCallbackRequest request,
            String nonce,
            String userAgent,
            String ip) {
        boolean acceptTerms =
                stateStore.consume(KEY_PREFIX, provider.name(), request.state(), nonce);
        OAuthProfile profile =
                googleOAuthClient.fetchProfile(request.code(), redirectUri(provider));
        return socialSignInService.signIn(provider, profile, acceptTerms, userAgent, ip);
    }

    private String redirectUri(OAuthProvider provider) {
        return appProperties.frontendUrl() + CALLBACK_PATH + provider.getPathSegment();
    }
}
