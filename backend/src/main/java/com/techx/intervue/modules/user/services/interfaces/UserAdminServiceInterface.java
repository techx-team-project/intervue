package com.techx.intervue.modules.user.services.interfaces;

import com.techx.intervue.common.web.RequestActor;
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

    Page<AdminUserListResource> search(SearchUsersRequest request, Pageable pageable);

    AdminUserDetailResource findDetail(Long userId);

    AdminUserSummaryResource summarise();

    AdminUserDetailResource restrict(Long userId, RestrictUserRequest request, RequestActor actor);

    AdminUserDetailResource liftRestriction(
            Long userId, LiftRestrictionRequest request, RequestActor actor);

    int liftExpiredRestrictions();

    Page<AdminUserActivityResource> findActivities(Long userId, Pageable pageable);

    List<AdminUserSessionResource> findSessions(Long userId);

    void revokeSession(Long userId, Long sessionId, RequestActor actor);

    void revokeAllSessions(Long userId, RequestActor actor);

    Page<AdminUserSignInResource> findSignIns(Long userId, Pageable pageable);

    AdminUserDetailResource grantRole(
            Long userId, GrantUserRoleRequest request, RequestActor actor);

    AdminUserDetailResource revokeRole(
            Long userId, RoleType role, RevokeUserRoleRequest request, RequestActor actor);

    int sweepExpiredRoleGrants();

    AdminUserDetailResource resetTwoFactor(Long userId, RequestActor actor);

    AdminUserDetailResource sendPasswordReset(Long userId, RequestActor actor);

    AdminUserDetailResource cancelDeletion(Long userId, RequestActor actor);

    AdminUserDetailResource restoreUser(Long userId, RequestActor actor);

    int purgeExpiredPendingDeletions();
}
