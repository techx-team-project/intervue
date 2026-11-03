package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.requests.RegisterRequest;
import com.techx.intervue.modules.user.resources.AuthResult;
import com.techx.intervue.modules.user.resources.UserResource;
import java.util.Collection;
import java.util.List;

public interface UserServiceInterface {

    AuthResult register(RegisterRequest request);

    AuthResult register(RegisterRequest request, String userAgent, String ip);

    UserResource getMe(Long userId);

    void updateBasicInfo(Long userId, String name, String address);

    List<UserResource> findByIds(Collection<Long> userIds);

    UserResource becomeRecruiter(Long userId);

    void requestAccountDeletion(Long userId);

    UserResource cancelAccountDeletion(Long userId);
}
