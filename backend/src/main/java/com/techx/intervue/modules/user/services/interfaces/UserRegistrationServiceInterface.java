package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.requests.RegisterRequest;
import com.techx.intervue.modules.user.resources.AuthResult;

public interface UserRegistrationServiceInterface {

    AuthResult register(RegisterRequest request);

    AuthResult register(RegisterRequest request, String userAgent, String ip);
}
