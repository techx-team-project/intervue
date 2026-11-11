package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.resources.ServiceCatalogResource;
import com.techx.intervue.modules.billing.resources.ServicePackageDetailResource;
import com.techx.intervue.modules.billing.services.interfaces.ServiceCatalogServiceInterface;
import com.techx.intervue.resources.ApiResource;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/recruiter/service-packages")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterServicePackageController extends BaseController {

    private final ServiceCatalogServiceInterface serviceCatalogService;

    @GetMapping
    public ResponseEntity<ApiResource<ServiceCatalogResource>> catalog() {
        return ok(serviceCatalogService.getCatalog(), "Service catalog retrieved successfully!");
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResource<ServicePackageDetailResource>> detail(
            @PathVariable String slug) {
        return ok(serviceCatalogService.getBySlug(slug), "Service package retrieved successfully!");
    }
}
