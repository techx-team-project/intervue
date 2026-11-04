package com.techx.intervue.modules.recruiter.services.interfaces;

public interface RecruiterEmailVerificationServiceInterface {
    void verify(String token);

    void resend(Long recruiterId, String ip);
}
