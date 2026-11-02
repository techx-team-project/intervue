package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.requests.RegisterRequest;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.resources.UserResource;

public interface UserServiceInterface {

    AuthResult register(RegisterRequest request);

    AuthResult register(RegisterRequest request, String userAgent, String ip);

    UserResource getMe(Long userId);
}
