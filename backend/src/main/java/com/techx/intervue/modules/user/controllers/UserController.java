package com.techx.intervue.modules.user.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.helpers.IpHelper;
import com.techx.intervue.modules.user.requests.SendPhoneOtpRequest;
import com.techx.intervue.modules.user.requests.VerifyPhoneOtpRequest;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.modules.user.resources.UserResource;
import com.techx.intervue.modules.user.services.interfaces.PhoneVerificationServiceInterface;
import com.techx.intervue.modules.user.services.interfaces.UserServiceInterface;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
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
}
