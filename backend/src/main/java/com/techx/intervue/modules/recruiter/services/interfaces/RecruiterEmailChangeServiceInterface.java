package com.techx.intervue.modules.recruiter.services.interfaces;

import com.techx.intervue.modules.user.requests.ChangeEmailRequest;

public interface RecruiterEmailChangeServiceInterface {
    void request(Long recruiterId, ChangeEmailRequest request, String ip);

    void confirm(String token);
}
