package com.techx.intervue.modules.recruiter.services.interfaces;

import com.techx.intervue.modules.recruiter.resources.RecruiterAuthResult;
import com.techx.intervue.modules.user.enums.OAuthProvider;
import com.techx.intervue.modules.user.requests.OAuthAuthorizeRequest;
import com.techx.intervue.modules.user.requests.OAuthCallbackRequest;
import com.techx.intervue.modules.user.resources.OAuthAuthorizeResult;

public interface RecruiterSocialAuthServiceInterface {

    OAuthAuthorizeResult authorize(
            OAuthProvider provider, OAuthAuthorizeRequest request, String ip);

    RecruiterAuthResult callback(
            OAuthProvider provider,
            OAuthCallbackRequest request,
            String nonce,
            String userAgent,
            String ip,
            String rawDeviceToken);
}
