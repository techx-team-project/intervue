package com.techx.intervue.modules.recruiter.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.helpers.CookieHelper;
import com.techx.intervue.modules.recruiter.resources.RecruiterTrustedDeviceResource;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterTwoFactorServiceInterface;
import com.techx.intervue.modules.user.requests.PasswordVerifyRequest;
import com.techx.intervue.modules.user.requests.TwoFactorVerifyRequest;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.modules.user.resources.TwoFactorSetupResource;
import com.techx.intervue.modules.user.resources.TwoFactorStatusResource;
import com.techx.intervue.resources.ApiResource;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter/two-factor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterTwoFactorController extends BaseController {

    private final RecruiterTwoFactorServiceInterface recruiterTwoFactorService;

    @GetMapping
    public ResponseEntity<ApiResource<TwoFactorStatusResource>> getStatus(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ok(
                recruiterTwoFactorService.getStatus(user.getId()),
                "2FA status retrieved successfully!");
    }

    @PostMapping("/setup")
    public ResponseEntity<ApiResource<TwoFactorSetupResource>> setup(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ok(
                recruiterTwoFactorService.setup(user.getId(), user.getEmail()),
                "2FA setup initiated successfully!");
    }

    @PostMapping("/confirm")
    public ResponseEntity<ApiResource<TwoFactorStatusResource>> confirm(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody TwoFactorVerifyRequest request) {
        return ok(
                recruiterTwoFactorService.confirm(user.getId(), request.code()),
                "Two-factor authentication has been enabled successfully!");
    }

    @PostMapping("/disable")
    public ResponseEntity<ApiResource<Void>> disable(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam(required = false) String password) {
        recruiterTwoFactorService.disable(user.getId(), password);
        return ok(null, "Two-factor authentication disabled successfully!");
    }

    @GetMapping("/devices")
    public ResponseEntity<ApiResource<List<RecruiterTrustedDeviceResource>>> getTrustedDevices(
            @AuthenticationPrincipal CustomUserDetails user,
            @CookieValue(name = CookieHelper.RECRUITER_DEVICE_TRUST_COOKIE, required = false)
                    String currentDeviceToken) {
        return ok(
                recruiterTwoFactorService.getTrustedDevices(user.getId(), currentDeviceToken),
                "Trusted devices retrieved successfully!");
    }

    @DeleteMapping("/devices/{id}")
    public ResponseEntity<ApiResource<Void>> revokeTrustedDevice(
            @AuthenticationPrincipal CustomUserDetails user, @PathVariable Long id) {
        recruiterTwoFactorService.revokeTrustedDevice(user.getId(), id);
        return ok(null, "Device trust revoked successfully!");
    }

    @DeleteMapping("/devices")
    public ResponseEntity<ApiResource<Void>> revokeAllTrustedDevices(
            @AuthenticationPrincipal CustomUserDetails user) {
        recruiterTwoFactorService.revokeAllTrustedDevices(user.getId());
        return ok(null, "All trusted devices have been revoked!");
    }

    @PostMapping("/recovery-codes/regenerate")
    public ResponseEntity<ApiResource<List<String>>> regenerateRecoveryCodes(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody PasswordVerifyRequest request) {
        List<String> codes =
                recruiterTwoFactorService.regenerateRecoveryCodes(user.getId(), request.password());
        return ok(codes, "Emergency recovery codes regenerated successfully!");
    }

    @PostMapping("/reconfigure/initiate")
    public ResponseEntity<ApiResource<TwoFactorSetupResource>> initiateReconfigure(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody PasswordVerifyRequest request) {
        TwoFactorSetupResource resource =
                recruiterTwoFactorService.reconfigure(user.getId(), request.password());
        return ok(resource, "Authenticator reconfiguration initiated successfully!");
    }

    @PostMapping("/reconfigure/confirm")
    public ResponseEntity<ApiResource<TwoFactorStatusResource>> confirmReconfigure(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody TwoFactorVerifyRequest request) {
        TwoFactorStatusResource resource =
                recruiterTwoFactorService.confirm(user.getId(), request.code());
        return ok(resource, "Authenticator reconfigured successfully!");
    }
}
