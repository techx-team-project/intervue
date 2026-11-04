package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.requests.ChangePasswordRequest;
import com.techx.intervue.modules.user.resources.AccountSessionResource;
import java.util.List;

public interface AccountSecurityServiceInterface {

    void changePassword(Long userId, ChangePasswordRequest request, String refreshToken);

    List<AccountSessionResource> findSessions(Long userId, String refreshToken);

    void revokeSession(Long userId, Long sessionId, String refreshToken);

    void revokeOtherSessions(Long userId, String refreshToken);
}
