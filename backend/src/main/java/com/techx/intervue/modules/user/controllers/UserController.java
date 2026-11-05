package com.techx.intervue.modules.user.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.helpers.CookieHelper;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.modules.user.requests.ChangeEmailRequest;
import com.techx.intervue.modules.user.requests.ChangePasswordRequest;
import com.techx.intervue.modules.user.requests.SendPhoneOtpRequest;
import com.techx.intervue.modules.user.requests.VerifyPhoneOtpRequest;
import com.techx.intervue.modules.user.resources.AccountSessionResource;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.modules.user.resources.UserResource;
import com.techx.intervue.modules.user.services.interfaces.AccountSecurityServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.EmailChangeServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.PhoneVerificationServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController extends BaseController {

    private final UserServiceInterface userService;
    private final PhoneVerificationServiceInterface phoneVerificationService;
    private final AccountSecurityServiceInterface accountSecurityService;
    private final EmailChangeServiceInterface emailChangeService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResource<UserResource>> me(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                userService.getMe(principal.getId()),
                "Account information retrieved successfully!");
    }

    @PostMapping("/me/phone/send-otp")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResource<Void>> sendPhoneOtp(
            @Valid @RequestBody SendPhoneOtpRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        phoneVerificationService.sendOtp(
                principal.getId(), request, IpHelper.getClientIp(httpRequest));
        return ok(null, "Verification code sent successfully!");
    }

    @PostMapping("/me/phone/verify")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResource<UserResource>> verifyPhoneOtp(
            @Valid @RequestBody VerifyPhoneOtpRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                phoneVerificationService.verifyOtp(
                        principal.getId(), request, IpHelper.getClientIp(httpRequest)),
                "Phone number verified successfully!");
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

    @PostMapping("/me/email/change-request")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResource<Void>> requestEmailChange(
            @Valid @RequestBody ChangeEmailRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        emailChangeService.request(principal.getId(), request, IpHelper.getClientIp(httpRequest));
        return ok(null, "We sent a confirmation link to your new email.");
    }

    @PostMapping("/me/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResource<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            @CookieValue(name = CookieHelper.REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken) {
        accountSecurityService.changePassword(principal.getId(), request, refreshToken);
        return ok(null, "Password changed successfully!");
    }

    @GetMapping("/me/sessions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResource<List<AccountSessionResource>>> sessions(
            @AuthenticationPrincipal CustomUserDetails principal,
            @CookieValue(name = CookieHelper.REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken) {
        return ok(
                accountSecurityService.findSessions(principal.getId(), refreshToken),
                "Sessions retrieved successfully!");
    }

    @DeleteMapping("/me/sessions/{sessionId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResource<Void>> revokeSession(
            @PathVariable Long sessionId,
            @AuthenticationPrincipal CustomUserDetails principal,
            @CookieValue(name = CookieHelper.REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken) {
        accountSecurityService.revokeSession(principal.getId(), sessionId, refreshToken);
        return ok(null, "Device signed out successfully!");
    }

    @PostMapping("/me/sessions/revoke-others")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResource<Void>> revokeOtherSessions(
            @AuthenticationPrincipal CustomUserDetails principal,
            @CookieValue(name = CookieHelper.REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken) {
        accountSecurityService.revokeOtherSessions(principal.getId(), refreshToken);
        return ok(null, "Signed out of all other devices!");
    }
}
