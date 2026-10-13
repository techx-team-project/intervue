package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.requests.LoginRequest;
import com.techx.intervue.modules.user.resources.AuthResult;

public interface AuthServiceInterface {
    AuthResult login(LoginRequest request, String ip);

    AuthResult refresh(String refreshToken);

    void logout(String accessToken, String refreshToken);
}
