package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.enums.OAuthProvider;
import com.techx.intervue.modules.user.requests.OAuthAuthorizeRequest;
import com.techx.intervue.modules.user.requests.OAuthCallbackRequest;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.resources.OAuthAuthorizeResult;

public interface SocialAuthServiceInterface {

    OAuthAuthorizeResult authorize(
            OAuthProvider provider, OAuthAuthorizeRequest request, String ip);

    AuthResult callback(
            OAuthProvider provider,
            OAuthCallbackRequest request,
            String nonce,
            String userAgent,
            String ip);
}
