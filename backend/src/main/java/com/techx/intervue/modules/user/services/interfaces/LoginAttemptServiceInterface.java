package com.techx.intervue.modules.user.services.interfaces;

public interface LoginAttemptServiceInterface {
    void recordFailure(String email, String ip);

    boolean isCaptchaRequired(String email, String ip);

    void reset(String email, String ip);
}
