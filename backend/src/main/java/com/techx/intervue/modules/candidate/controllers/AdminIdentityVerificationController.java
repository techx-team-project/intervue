package com.techx.intervue.modules.candidate.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.candidate.requests.RejectIdentityVerificationRequest;
import com.techx.intervue.modules.candidate.requests.SearchIdentityVerificationRequest;
import com.techx.intervue.modules.candidate.resources.AdminIdentityVerificationResource;
import com.techx.intervue.modules.candidate.services.interfaces.IdentityVerificationAdminServiceInterface;
import com.techx.intervue.modules.candidate.services.interfaces.IdentityVerificationAdminServiceInterface.DocumentSide;
import com.techx.intervue.modules.company.services.interfaces.CompanyVerificationServiceInterface.StoredDocumentContent;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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
@RequestMapping("/api/v1/admin/identity-verifications")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminIdentityVerificationController extends BaseController {

    private final IdentityVerificationAdminServiceInterface adminService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<AdminIdentityVerificationResource>>> search(
            @Valid SearchIdentityVerificationRequest request, Pageable pageable) {
        return page(
                adminService.search(request, pageable),
                "Identity verifications retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<AdminIdentityVerificationResource>> detail(
            @PathVariable Long id) {
        return ok(adminService.findOne(id), "Identity verification retrieved successfully!");
    }

    // Streams the bytes inline so reviewing an identity image never saves it to the reviewer's
    // disk.
    @GetMapping("/{id}/documents/{side}")
    public ResponseEntity<byte[]> document(
            @PathVariable Long id,
            @PathVariable DocumentSide side,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        StoredDocumentContent content =
                adminService.readDocument(id, side, actor(principal, httpRequest));
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(content.contentType()))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.inline().filename(content.fileName()).build().toString())
                .body(content.bytes());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResource<AdminIdentityVerificationResource>> approve(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                adminService.approve(id, actor(principal, httpRequest)),
                "Identity verification approved successfully!");
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResource<AdminIdentityVerificationResource>> reject(
            @PathVariable Long id,
            @Valid @RequestBody RejectIdentityVerificationRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                adminService.reject(id, request, actor(principal, httpRequest)),
                "Identity verification rejected successfully!");
    }

    @PostMapping("/{id}/grant-attempts")
    public ResponseEntity<ApiResource<AdminIdentityVerificationResource>> grantAttempts(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest httpRequest) {
        return ok(
                adminService.grantAttempts(id, actor(principal, httpRequest)),
                "Additional attempts granted successfully!");
    }
}
