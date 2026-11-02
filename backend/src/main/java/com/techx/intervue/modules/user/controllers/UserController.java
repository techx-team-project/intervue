package com.techx.intervue.modules.user.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.modules.user.resources.UserResource;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import com.techx.intervue.resources.ApiResource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController extends BaseController {

    private final UserServiceInterface userService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResource<UserResource>> me(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                userService.getMe(principal.getId()),
                "Account information retrieved successfully!");
    }

    @PostMapping("/me/roles/recruiter")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResource<UserResource>> becomeRecruiter(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                userService.becomeRecruiter(principal.getId()),
                "Recruiter role enabled successfully!");
    }

    @PostMapping("/me/delete-request")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResource<Void>> requestDeletion(
            @AuthenticationPrincipal CustomUserDetails principal) {
        userService.requestAccountDeletion(principal.getId());
        return ok(null, "Account deletion request submitted. 7-day recovery grace period started.");
    }

    @PostMapping("/me/cancel-deletion")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResource<UserResource>> cancelDeletion(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                userService.cancelAccountDeletion(principal.getId()),
                "Account deletion request cancelled successfully!");
    }
}
