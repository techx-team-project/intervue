package com.techx.intervue.modules.user.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.user.requests.PasswordVerifyRequest;
import com.techx.intervue.modules.user.requests.TwoFactorVerifyRequest;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.modules.user.resources.TwoFactorSetupResource;
import com.techx.intervue.modules.user.resources.TwoFactorStatusResource;
import com.techx.intervue.modules.user.services.interfaces.AdminAuthServiceInterface;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import java.util.List;
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
@RequestMapping("/api/v1/admin/two-factor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminTwoFactorController extends BaseController {

    private final AdminAuthServiceInterface adminAuthService;

    @GetMapping("/status")
    public ResponseEntity<ApiResource<TwoFactorStatusResource>> getStatus(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ok(
                adminAuthService.getTwoFactorStatus(user.getId()),
                "Admin 2FA status retrieved successfully!");
    }

    @PostMapping("/reconfigure/initiate")
    public ResponseEntity<ApiResource<TwoFactorSetupResource>> initiateReconfigure(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody PasswordVerifyRequest request) {
        return ok(
                adminAuthService.reconfigureTwoFactor(user.getId(), request.password()),
                "Admin 2FA reconfigure initiated successfully!");
    }

    @PostMapping("/reconfigure/confirm")
    public ResponseEntity<ApiResource<TwoFactorStatusResource>> confirmReconfigure(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody TwoFactorVerifyRequest request) {
        return ok(
                adminAuthService.confirmTwoFactorReconfigure(user.getId(), request.code()),
                "Admin 2FA authenticator updated successfully!");
    }

    @PostMapping("/recovery-codes/regenerate")
    public ResponseEntity<ApiResource<List<String>>> regenerateRecoveryCodes(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody PasswordVerifyRequest request) {
        return ok(
                adminAuthService.regenerateRecoveryCodes(user.getId(), request.password()),
                "Admin recovery codes regenerated successfully!");
    }
}
