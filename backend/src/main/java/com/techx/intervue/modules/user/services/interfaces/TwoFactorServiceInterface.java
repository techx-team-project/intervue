package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.resources.TwoFactorSetupResource;
import com.techx.intervue.modules.user.resources.TwoFactorStatusResource;

public interface TwoFactorServiceInterface {

    TwoFactorSetupResource setup(Long userId, String email);

    TwoFactorStatusResource getStatus(Long userId);

    TwoFactorStatusResource confirm(Long userId, String code);

    void disable(Long userId, String password);

    boolean verifyCodeOrRecoveryCode(Long userId, String code);

    boolean isTwoFactorEnabled(Long userId);

    java.util.List<String> regenerateRecoveryCodes(Long userId);
}
