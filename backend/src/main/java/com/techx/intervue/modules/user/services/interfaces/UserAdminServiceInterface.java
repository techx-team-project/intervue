package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.modules.user.enums.RoleType;
import com.techx.intervue.modules.user.requests.GrantUserRoleRequest;
import com.techx.intervue.modules.user.requests.LiftRestrictionRequest;
import com.techx.intervue.modules.user.requests.RestrictUserRequest;
import com.techx.intervue.modules.user.requests.RevokeUserRoleRequest;
import com.techx.intervue.modules.user.requests.SearchUsersRequest;
import com.techx.intervue.modules.user.resources.AdminUserActivityResource;
import com.techx.intervue.modules.user.resources.AdminUserDetailResource;
import com.techx.intervue.modules.user.resources.AdminUserListResource;
import com.techx.intervue.modules.user.resources.AdminUserSessionResource;
import com.techx.intervue.modules.user.resources.AdminUserSignInResource;
import com.techx.intervue.modules.user.resources.AdminUserSummaryResource;
import java.util.List;
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

    int liftExpiredRestrictions();

    Page<AdminUserActivityResource> findActivities(Long userId, Pageable pageable);

    List<AdminUserSessionResource> findSessions(Long userId);

    void revokeSession(Long userId, Long sessionId, AdminActor actor);

    void revokeAllSessions(Long userId, AdminActor actor);

    Page<AdminUserSignInResource> findSignIns(Long userId, Pageable pageable);

    AdminUserDetailResource grantRole(Long userId, GrantUserRoleRequest request, AdminActor actor);

    AdminUserDetailResource revokeRole(
            Long userId, RoleType role, RevokeUserRoleRequest request, AdminActor actor);

    int sweepExpiredRoleGrants();

    AdminUserDetailResource resetTwoFactor(Long userId, AdminActor actor);

    AdminUserDetailResource sendPasswordReset(Long userId, AdminActor actor);
}
