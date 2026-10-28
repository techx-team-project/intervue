package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.requests.RegisterRequest;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.resources.UserResource;

public interface UserServiceInterface {
    AuthResult register(RegisterRequest request);

    UserResource getMe(Long userId);

    UserResource becomeRecruiter(Long userId);
}
