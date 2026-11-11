package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.enums.ServicePackageStatus;
import com.techx.intervue.modules.billing.requests.AdminSearchServicePackagesRequest;
import com.techx.intervue.modules.billing.requests.SaveServicePackageRequest;
import com.techx.intervue.modules.billing.resources.AdminServicePackageResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminServiceCatalogServiceInterface;
import com.techx.intervue.modules.billing.services.interfaces.AdminServiceCatalogServiceInterface.UploadedPackageImageResource;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/service-packages")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminServicePackageController extends BaseController {

    private final AdminServiceCatalogServiceInterface adminServiceCatalogService;

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<AdminServicePackageResource>>> search(
            @Valid AdminSearchServicePackagesRequest request, Pageable pageable) {
        return page(
                adminServiceCatalogService.searchPackages(request, pageable),
                "Service packages retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<AdminServicePackageResource>> detail(@PathVariable Long id) {
        return ok(
                adminServiceCatalogService.getPackage(id),
                "Service package retrieved successfully!");
    }

    @PostMapping
    public ResponseEntity<ApiResource<AdminServicePackageResource>> create(
            @Valid @RequestBody SaveServicePackageRequest body,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest request) {
        return created(
                adminServiceCatalogService.createPackage(body, actor(principal, request)),
                "Service package created successfully!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResource<AdminServicePackageResource>> update(
            @PathVariable Long id,
            @Valid @RequestBody SaveServicePackageRequest body,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest request) {
        return ok(
                adminServiceCatalogService.updatePackage(id, body, actor(principal, request)),
                "Service package updated successfully!");
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<ApiResource<AdminServicePackageResource>> activate(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest request) {
        return ok(
                adminServiceCatalogService.setStatus(
                        id, ServicePackageStatus.ACTIVE, actor(principal, request)),
                "Service package activated successfully!");
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<ApiResource<AdminServicePackageResource>> deactivate(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest request) {
        return ok(
                adminServiceCatalogService.setStatus(
                        id, ServicePackageStatus.INACTIVE, actor(principal, request)),
                "Service package deactivated successfully!");
    }

    @PostMapping("/upload-image")
    public ResponseEntity<ApiResource<UploadedPackageImageResource>> uploadImage(
            @RequestParam("file") MultipartFile file) {
        return created(
                adminServiceCatalogService.uploadPackageImage(file),
                "Service package image uploaded successfully!");
    }
}
