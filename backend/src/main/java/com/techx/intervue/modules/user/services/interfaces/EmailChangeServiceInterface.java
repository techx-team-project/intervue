package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.requests.ChangeEmailRequest;

public interface EmailChangeServiceInterface {
    void request(Long userId, ChangeEmailRequest request, String ip);

    void confirm(String token);
}
