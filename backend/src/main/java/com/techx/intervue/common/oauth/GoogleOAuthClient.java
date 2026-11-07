package com.techx.intervue.common.oauth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.techx.intervue.config.OAuthProperties;
import com.techx.intervue.exceptions.AppException;
import com.techx.intervue.exceptions.ErrorCode;
import java.net.URI;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Service
public class GoogleOAuthClient implements GoogleOAuthClientInterface {

    private static final String AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth";
    private static final String TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";
    private static final String SCOPE = "openid email profile";

    private final RestClient restClient;
    private final OAuthProperties properties;

    public GoogleOAuthClient(
            @Qualifier("oauthRestClient") RestClient restClient, OAuthProperties properties) {
        this.restClient = restClient;
        this.properties = properties;
    }

    @Override
    public String authorizationUrl(String state, String redirectUri) {
        requireConfigured();
        return UriComponentsBuilder.fromUriString(AUTHORIZATION_URL)
                .queryParam("client_id", "{clientId}")
                .queryParam("redirect_uri", "{redirectUri}")
                .queryParam("response_type", "code")
                .queryParam("scope", "{scope}")
                .queryParam("state", "{state}")
                .queryParam("prompt", "select_account")
                .encode()
                .buildAndExpand(
                        Map.of(
                                "clientId", properties.google().clientId(),
                                "redirectUri", redirectUri,
                                "scope", SCOPE,
                                "state", state))
                .toUriString();
    }

    @Override
    public OAuthProfile fetchProfile(String code, String redirectUri) {
        requireConfigured();
        try {
            TokenResponse token = exchangeCode(code, redirectUri);
            if (token == null || token.accessToken() == null || token.accessToken().isBlank()) {
                throw new AppException(ErrorCode.OAUTH_PROVIDER_ERROR);
            }
            UserInfoResponse info =
                    restClient
                            .get()
                            .uri(URI.create(USERINFO_URL))
                            .header(HttpHeaders.AUTHORIZATION, "Bearer " + token.accessToken())
                            .retrieve()
                            .body(UserInfoResponse.class);
            if (info == null || info.sub() == null || info.sub().isBlank()) {
                throw new AppException(ErrorCode.OAUTH_PROVIDER_ERROR);
            }
            return new OAuthProfile(
                    info.sub(),
                    info.email(),
                    Boolean.TRUE.equals(info.emailVerified()),
                    info.name(),
                    info.hd());
        } catch (RestClientResponseException e) {
            log.warn("Google sign-in rejected: HTTP {}", e.getStatusCode().value());
            throw new AppException(ErrorCode.OAUTH_PROVIDER_ERROR);
        } catch (RestClientException e) {
            log.warn("Google sign-in failed: {}", e.getClass().getSimpleName());
            throw new AppException(ErrorCode.OAUTH_PROVIDER_ERROR);
        }
    }

    private TokenResponse exchangeCode(String code, String redirectUri) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("code", code);
        form.add("client_id", properties.google().clientId());
        form.add("client_secret", properties.google().clientSecret());
        form.add("redirect_uri", redirectUri);
        form.add("grant_type", "authorization_code");
        return restClient
                .post()
                .uri(URI.create(TOKEN_URL))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(TokenResponse.class);
    }

    private void requireConfigured() {
        OAuthProperties.Google google = properties.google();
        if (google == null || isBlank(google.clientId()) || isBlank(google.clientSecret())) {
            throw new AppException(ErrorCode.OAUTH_NOT_CONFIGURED);
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record TokenResponse(@JsonProperty("access_token") String accessToken) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record UserInfoResponse(
            String sub,
            String email,
            @JsonProperty("email_verified") Boolean emailVerified,
            String name,
            String hd) {}
}
