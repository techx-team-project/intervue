package com.techx.intervue.modules.recruiter.services.interfaces;

import com.techx.intervue.modules.user.resources.TwoFactorSetupResource;
import com.techx.intervue.modules.user.resources.TwoFactorStatusResource;

public interface RecruiterTwoFactorServiceInterface {

    TwoFactorSetupResource setup(Long recruiterId, String email);

    TwoFactorStatusResource getStatus(Long recruiterId);

    TwoFactorStatusResource confirm(Long recruiterId, String code);

    void disable(Long recruiterId, String password);

    boolean verifyCodeOrRecoveryCode(Long recruiterId, String code);

    boolean isTwoFactorEnabled(Long recruiterId);
}
