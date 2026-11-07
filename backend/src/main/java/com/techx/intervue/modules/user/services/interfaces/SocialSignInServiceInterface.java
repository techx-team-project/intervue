package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.common.oauth.OAuthProfile;
import com.techx.intervue.modules.user.enums.OAuthProvider;
import com.techx.intervue.modules.user.resources.AuthResult;

public interface SocialSignInServiceInterface {

    AuthResult signIn(
            OAuthProvider provider,
            OAuthProfile profile,
            boolean acceptTerms,
            String userAgent,
            String ip);
}
