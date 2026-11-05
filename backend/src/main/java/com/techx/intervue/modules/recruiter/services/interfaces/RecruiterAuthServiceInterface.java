package com.techx.intervue.modules.recruiter.services.interfaces;

import com.techx.intervue.modules.recruiter.requests.RecruiterRegisterRequest;
import com.techx.intervue.modules.recruiter.resources.RecruiterAuthResult;
import com.techx.intervue.modules.user.requests.LoginRequest;

public interface RecruiterAuthServiceInterface {

    RecruiterAuthResult register(RecruiterRegisterRequest request, String userAgent, String ip);

    RecruiterAuthResult login(LoginRequest request, String userAgent, String ip);

    RecruiterAuthResult verifyTwoFactor(
            com.techx.intervue.modules.user.requests.TwoFactorChallengeRequest request,
            String userAgent,
            String ip);

    RecruiterAuthResult refresh(String refreshToken, String userAgent, String ip);

    void logout(String accessToken, String refreshToken);
}
