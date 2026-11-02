package com.techx.intervue.modules.user.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.modules.user.requests.LiftRestrictionRequest;
import com.techx.intervue.modules.user.requests.RestrictUserRequest;
import com.techx.intervue.modules.user.requests.SearchUsersRequest;
import com.techx.intervue.modules.user.resources.AdminUserActivityResource;
import com.techx.intervue.modules.user.resources.AdminUserDetailResource;
import com.techx.intervue.modules.user.resources.AdminUserListResource;
import com.techx.intervue.modules.user.resources.AdminUserSessionResource;
import com.techx.intervue.modules.user.resources.AdminUserSignInResource;
import com.techx.intervue.modules.user.resources.AdminUserSummaryResource;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.modules.user.services.interfaces.UserAdminServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserAdminServiceInterface.AdminActor;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController extends BaseController {

    private final UserAdminServiceInterface userAdminService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<AdminUserListResource>>> search(
            @Valid SearchUsersRequest request, Pageable pageable) {
        return ok(
                PageResource.of(userAdminService.search(request, pageable)),
                "Accounts retrieved successfully!");
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResource<AdminUserSummaryResource>> summary() {
        return ok(userAdminService.summarise(), "Account summary retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<AdminUserDetailResource>> detail(@PathVariable Long id) {
        return ok(userAdminService.findDetail(id), "Account details retrieved successfully!");
    }

    @GetMapping("/{id}/activity")
    public ResponseEntity<ApiResource<PageResource<AdminUserActivityResource>>> activity(
            @PathVariable Long id, Pageable pageable) {
        return ok(
                PageResource.of(userAdminService.findActivities(id, pageable)),
                "Account activity history retrieved successfully!");
    }

    @PostMapping("/{id}/ban")
    public ResponseEntity<ApiResource<AdminUserDetailResource>> ban(
            @PathVariable Long id,
            @Valid @RequestBody RestrictUserRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                userAdminService.restrict(id, request, actor(principal, httpRequest)),
                "Account banned successfully!");
    }

    @PostMapping("/{id}/unban")
    public ResponseEntity<ApiResource<AdminUserDetailResource>> unban(
            @PathVariable Long id,
            @Valid @RequestBody LiftRestrictionRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                userAdminService.liftRestriction(id, request, actor(principal, httpRequest)),
                "Account unbanned successfully!");
    }

    @GetMapping("/{id}/sessions")
    public ResponseEntity<ApiResource<List<AdminUserSessionResource>>> sessions(
            @PathVariable Long id) {
        return ok(userAdminService.findSessions(id), "Active sessions retrieved successfully!");
    }

    @DeleteMapping("/{id}/sessions/{sessionId}")
    public ResponseEntity<ApiResource<Void>> revokeSession(
            @PathVariable Long id,
            @PathVariable Long sessionId,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        userAdminService.revokeSession(id, sessionId, actor(principal, httpRequest));
        return ok(null, "Session revoked successfully!");
    }

    @PostMapping("/{id}/sessions/revoke-all")
    public ResponseEntity<ApiResource<Void>> revokeAllSessions(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        userAdminService.revokeAllSessions(id, actor(principal, httpRequest));
        return ok(null, "All sessions revoked successfully!");
    }

    @GetMapping("/{id}/sign-ins")
    public ResponseEntity<ApiResource<PageResource<AdminUserSignInResource>>> signIns(
            @PathVariable Long id, Pageable pageable) {
        return ok(
                PageResource.of(userAdminService.findSignIns(id, pageable)),
                "Sign-in history retrieved successfully!");
    }

    private AdminActor actor(CustomUserDetails principal, HttpServletRequest httpRequest) {
        return new AdminActor(
                principal.getId(), principal.getEmail(), IpHelper.getClientIp(httpRequest));
    }
}
