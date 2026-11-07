package com.techx.intervue.modules.recruiter.services.interfaces;

import com.techx.intervue.common.oauth.OAuthProfile;
import com.techx.intervue.modules.recruiter.resources.RecruiterAuthResult;
import com.techx.intervue.modules.user.enums.OAuthProvider;

public interface RecruiterSocialSignInServiceInterface {

    RecruiterAuthResult signIn(
            OAuthProvider provider,
            OAuthProfile profile,
            boolean acceptTerms,
            String userAgent,
            String ip,
            String rawDeviceToken);
}
