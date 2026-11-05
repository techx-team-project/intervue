package com.techx.intervue.modules.recruiter.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.recruiter.services.interfaces.RecruiterTwoFactorServiceInterface;
import com.techx.intervue.modules.user.requests.TwoFactorVerifyRequest;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.modules.user.resources.TwoFactorSetupResource;
import com.techx.intervue.modules.user.resources.TwoFactorStatusResource;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
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
}
