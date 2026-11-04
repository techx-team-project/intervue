package com.techx.intervue.modules.recruiter.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.helpers.CookieHelper;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.modules.recruiter.resources.RecruiterResource;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterAccountSecurityServiceInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterEmailChangeServiceInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterPhoneVerificationServiceInterface;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterServiceInterface;
import com.techx.intervue.modules.user.requests.ChangeEmailRequest;
import com.techx.intervue.modules.user.requests.ChangePasswordRequest;
import com.techx.intervue.modules.user.requests.SendPhoneOtpRequest;
import com.techx.intervue.modules.user.requests.VerifyPhoneOtpRequest;
import com.techx.intervue.modules.user.resources.AccountSessionResource;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
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
@RequestMapping("/api/v1/recruiter/me")
@PreAuthorize("hasRole('RECRUITER')")
@RequiredArgsConstructor
public class RecruiterController extends BaseController {

    private final RecruiterServiceInterface recruiterService;
    private final RecruiterAccountSecurityServiceInterface accountSecurityService;
    private final RecruiterPhoneVerificationServiceInterface phoneVerificationService;
    private final RecruiterEmailChangeServiceInterface emailChangeService;

    @GetMapping
    public ResponseEntity<ApiResource<RecruiterResource>> me(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                recruiterService.getMe(principal.getId()),
                "Account information retrieved successfully!");
    }

    @PostMapping("/phone/send-otp")
    public ResponseEntity<ApiResource<Void>> sendPhoneOtp(
            @Valid @RequestBody SendPhoneOtpRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        phoneVerificationService.sendOtp(
                principal.getId(), request, IpHelper.getClientIp(httpRequest));
        return ok(null, "Verification code sent successfully!");
    }

    @PostMapping("/phone/verify")
    public ResponseEntity<ApiResource<RecruiterResource>> verifyPhoneOtp(
            @Valid @RequestBody VerifyPhoneOtpRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                phoneVerificationService.verifyOtp(
                        principal.getId(), request, IpHelper.getClientIp(httpRequest)),
                "Phone number verified successfully!");
    }

    @PostMapping("/delete-request")
    public ResponseEntity<ApiResource<Void>> requestDeletion(
            @AuthenticationPrincipal CustomUserDetails principal) {
        recruiterService.requestAccountDeletion(principal.getId());
        return ok(null, "Account deletion request submitted. 7-day recovery grace period started.");
    }

    @PostMapping("/cancel-deletion")
    public ResponseEntity<ApiResource<RecruiterResource>> cancelDeletion(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                recruiterService.cancelAccountDeletion(principal.getId()),
                "Account deletion request cancelled successfully!");
    }

    @PostMapping("/email/change-request")
    public ResponseEntity<ApiResource<Void>> requestEmailChange(
            @Valid @RequestBody ChangeEmailRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        emailChangeService.request(principal.getId(), request, IpHelper.getClientIp(httpRequest));
        return ok(null, "We sent a confirmation link to your new email.");
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResource<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            @CookieValue(name = CookieHelper.RECRUITER_REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken) {
        accountSecurityService.changePassword(principal.getId(), request, refreshToken);
        return ok(null, "Password changed successfully!");
    }

    @GetMapping("/sessions")
    public ResponseEntity<ApiResource<List<AccountSessionResource>>> sessions(
            @AuthenticationPrincipal CustomUserDetails principal,
            @CookieValue(name = CookieHelper.RECRUITER_REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken) {
        return ok(
                accountSecurityService.findSessions(principal.getId(), refreshToken),
                "Sessions retrieved successfully!");
    }

    @DeleteMapping("/sessions/{sessionId}")
    public ResponseEntity<ApiResource<Void>> revokeSession(
            @PathVariable Long sessionId,
            @AuthenticationPrincipal CustomUserDetails principal,
            @CookieValue(name = CookieHelper.RECRUITER_REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken) {
        accountSecurityService.revokeSession(principal.getId(), sessionId, refreshToken);
        return ok(null, "Device signed out successfully!");
    }

    @PostMapping("/sessions/revoke-others")
    public ResponseEntity<ApiResource<Void>> revokeOtherSessions(
            @AuthenticationPrincipal CustomUserDetails principal,
            @CookieValue(name = CookieHelper.RECRUITER_REFRESH_TOKEN_COOKIE, required = false)
                    String refreshToken) {
        accountSecurityService.revokeOtherSessions(principal.getId(), refreshToken);
        return ok(null, "Signed out of all other devices!");
    }
}
