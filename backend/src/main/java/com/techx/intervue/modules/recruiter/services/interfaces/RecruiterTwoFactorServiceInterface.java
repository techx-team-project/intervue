package com.techx.intervue.modules.recruiter.services.interfaces;

import com.techx.intervue.modules.recruiter.resources.RecruiterTrustedDeviceResource;
import com.techx.intervue.modules.user.resources.TwoFactorSetupResource;
import com.techx.intervue.modules.user.resources.TwoFactorStatusResource;
import java.util.List;

public interface RecruiterTwoFactorServiceInterface {

    TwoFactorSetupResource setup(Long recruiterId, String email);

    TwoFactorStatusResource getStatus(Long recruiterId);

    TwoFactorStatusResource confirm(Long recruiterId, String code);

    void disable(Long recruiterId, String password);

    boolean verifyCodeOrRecoveryCode(Long recruiterId, String code);

    boolean isTwoFactorEnabled(Long recruiterId);

    boolean isDeviceTrusted(Long recruiterId, String rawDeviceToken);

    String registerTrustedDevice(Long recruiterId, String userAgent, String ipAddress);

    List<RecruiterTrustedDeviceResource> getTrustedDevices(
            Long recruiterId, String currentRawDeviceToken);

    void revokeTrustedDevice(Long recruiterId, Long deviceId);

    void revokeAllTrustedDevices(Long recruiterId);

    List<String> regenerateRecoveryCodes(Long recruiterId, String password);

    TwoFactorSetupResource reconfigure(Long recruiterId, String password);

    boolean verifyPassword(Long recruiterId, String password);
}
