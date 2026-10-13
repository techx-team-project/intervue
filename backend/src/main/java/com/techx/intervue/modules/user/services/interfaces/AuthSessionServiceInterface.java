package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.entities.User;
import com.techx.intervue.modules.user.resources.AuthResult;

public interface AuthSessionServiceInterface {
    AuthResult open(User user);

    AuthResult renew(User user, String refreshToken);
}
