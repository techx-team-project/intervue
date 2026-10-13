package com.techx.intervue.modules.user.services.interfaces;

public interface EmailVerificationServiceInterface {
    void verify(String token);

    void resend(Long userId, String ip);
}
