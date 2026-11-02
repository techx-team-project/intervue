package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.requests.LiftRestrictionRequest;
import com.techx.intervue.modules.user.requests.RestrictUserRequest;
import com.techx.intervue.modules.user.requests.SearchUsersRequest;
import com.techx.intervue.modules.user.resources.AdminUserDetailResource;
import com.techx.intervue.modules.user.resources.AdminUserListResource;
import com.techx.intervue.modules.user.resources.AdminUserSummaryResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserAdminServiceInterface {

    record AdminActor(Long id, String email, String ip) {}

    Page<AdminUserListResource> search(SearchUsersRequest request, Pageable pageable);

    AdminUserDetailResource findDetail(Long userId);

    AdminUserSummaryResource summarise();

    AdminUserDetailResource restrict(Long userId, RestrictUserRequest request, AdminActor actor);

    AdminUserDetailResource liftRestriction(
            Long userId, LiftRestrictionRequest request, AdminActor actor);
}
