package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.requests.LoginRequest;
import com.techx.intervue.modules.user.requests.TwoFactorChallengeRequest;
import com.techx.intervue.modules.user.resources.AdminAuthResult;
import com.techx.intervue.modules.user.resources.AdminProfileResource;
import com.techx.intervue.modules.user.resources.TwoFactorSetupResource;
import com.techx.intervue.modules.user.resources.TwoFactorStatusResource;
import java.util.List;

public interface AdminAuthServiceInterface {

    AdminAuthResult login(LoginRequest request, String userAgent, String ip);

    AdminAuthResult verifyTwoFactor(TwoFactorChallengeRequest request, String userAgent, String ip);

    TwoFactorSetupResource initiateTwoFactorSetup(String tempToken);

    AdminAuthResult confirmTwoFactorSetup(
            TwoFactorChallengeRequest request, String userAgent, String ip);

    boolean verifyPassword(Long adminUserId, String password);

    TwoFactorStatusResource getTwoFactorStatus(Long adminUserId);

    TwoFactorSetupResource reconfigureTwoFactor(Long adminUserId, String password);

    TwoFactorStatusResource confirmTwoFactorReconfigure(Long adminUserId, String code);

    List<String> regenerateRecoveryCodes(Long adminUserId, String password);

    AdminAuthResult refresh(String refreshToken, String userAgent, String ip);

    void logout(String accessToken, String refreshToken);

    AdminProfileResource getMe(Long adminUserId);
}
