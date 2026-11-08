package com.techx.intervue.common.oauth;

public interface GoogleOAuthClientInterface {

    String authorizationUrl(String state, String redirectUri);

    OAuthProfile fetchProfile(String code, String redirectUri);
}
