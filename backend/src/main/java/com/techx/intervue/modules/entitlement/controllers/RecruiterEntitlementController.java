package com.techx.intervue.modules.entitlement.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.entitlement.requests.ActivateEntitlementRequest;
import com.techx.intervue.modules.entitlement.resources.EntitlementResource;
import com.techx.intervue.modules.entitlement.resources.EntitlementUsageResource;
import com.techx.intervue.modules.entitlement.services.interfaces.RecruiterEntitlementServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter/entitlements")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterEntitlementController extends BaseController {

    private final RecruiterEntitlementServiceInterface entitlementService;

    @GetMapping
    public ResponseEntity<ApiResource<List<EntitlementResource>>> stock(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                entitlementService.listStock(principal.getId()),
                "Services retrieved successfully!");
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResource<List<EntitlementUsageResource>>> active(
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                entitlementService.listActive(principal.getId()),
                "Running services retrieved successfully!");
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<ApiResource<EntitlementResource>> activate(
            @PathVariable Long id,
            @Valid @RequestBody ActivateEntitlementRequest request,
            @AuthenticationPrincipal CustomUserDetails principal) {
        return ok(
                entitlementService.activate(id, request, principal.getId()),
                "Service applied to the job successfully!");
    }
}
