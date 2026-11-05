package com.techx.intervue.modules.recruiter.services.interfaces;

import com.techx.intervue.modules.user.requests.ChangePasswordRequest;
import com.techx.intervue.modules.user.resources.AccountSessionResource;
import java.util.List;

public interface RecruiterAccountSecurityServiceInterface {

    void changePassword(Long recruiterId, ChangePasswordRequest request, String refreshToken);

    List<AccountSessionResource> findSessions(Long recruiterId, String refreshToken);

    void revokeSession(Long recruiterId, Long sessionId, String refreshToken);

    void revokeOtherSessions(Long recruiterId, String refreshToken);
}
