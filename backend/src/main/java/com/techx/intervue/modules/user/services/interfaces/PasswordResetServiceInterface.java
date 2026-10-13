package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.requests.ForgotPasswordRequest;
import com.techx.intervue.modules.user.requests.ResetPasswordRequest;

public interface PasswordResetServiceInterface {
    void forgot(ForgotPasswordRequest request, String ip);

    void reset(ResetPasswordRequest request);
}
