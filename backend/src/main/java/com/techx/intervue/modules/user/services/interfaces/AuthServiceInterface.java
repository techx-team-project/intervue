package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.requests.LoginRequest;
import com.techx.intervue.modules.user.resources.AuthResult;

public interface AuthServiceInterface {

    AuthResult login(LoginRequest request, String ip);

    AuthResult login(LoginRequest request, String userAgent, String ip);

    AuthResult completeSignIn(User user, String userAgent, String ip);

    AuthResult verifyTwoFactor(
            com.techx.intervue.modules.user.requests.TwoFactorChallengeRequest request,
            String userAgent,
            String ip);

    AuthResult refresh(String refreshToken);

    AuthResult refresh(String refreshToken, String userAgent, String ip);

    void logout(String accessToken, String refreshToken);
}
