package com.techx.intervue.common.oauth;

import java.util.function.Function;

public interface OAuthStateStoreInterface {

    IssuedAuthorization issue(
            String keyPrefix,
            String provider,
            boolean acceptTerms,
            Function<String, String> authorizationUrlFor);

    boolean consume(String keyPrefix, String provider, String state, String nonce);

    record IssuedAuthorization(String authorizationUrl, String nonce) {}
}
