package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.requests.LoginRequest;
import com.techx.intervue.modules.user.requests.TwoFactorChallengeRequest;
import com.techx.intervue.modules.user.resources.AdminAuthResult;
import com.techx.intervue.modules.user.resources.AdminProfileResource;

public interface AdminAuthServiceInterface {

    AdminAuthResult login(LoginRequest request, String userAgent, String ip);

    AdminAuthResult verifyTwoFactor(TwoFactorChallengeRequest request, String userAgent, String ip);

    AdminAuthResult refresh(String refreshToken, String userAgent, String ip);

    void logout(String accessToken, String refreshToken);

    AdminProfileResource getMe(Long adminUserId);
}
