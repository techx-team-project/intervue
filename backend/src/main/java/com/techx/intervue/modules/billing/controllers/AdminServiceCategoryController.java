package com.techx.intervue.modules.billing.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.billing.requests.ReorderServiceCategoriesRequest;
import com.techx.intervue.modules.billing.requests.SaveServiceCategoryRequest;
import com.techx.intervue.modules.billing.resources.AdminServiceCategoryResource;
import com.techx.intervue.modules.billing.services.interfaces.AdminServiceCatalogServiceInterface;
import com.techx.intervue.modules.user.resources.CustomUserDetails;
import com.techx.intervue.resources.ApiResource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/service-categories")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminServiceCategoryController extends BaseController {

    private final AdminServiceCatalogServiceInterface adminServiceCatalogService;

    @GetMapping
    public ResponseEntity<ApiResource<List<AdminServiceCategoryResource>>> list() {
        return ok(
                adminServiceCatalogService.listCategories(),
                "Service categories retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<AdminServiceCategoryResource>> detail(@PathVariable Long id) {
        return ok(
                adminServiceCatalogService.getCategory(id),
                "Service category retrieved successfully!");
    }

    @PostMapping
    public ResponseEntity<ApiResource<AdminServiceCategoryResource>> create(
            @Valid @RequestBody SaveServiceCategoryRequest body,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest request) {
        return created(
                adminServiceCatalogService.createCategory(body, actor(principal, request)),
                "Service category created successfully!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResource<AdminServiceCategoryResource>> update(
            @PathVariable Long id,
            @Valid @RequestBody SaveServiceCategoryRequest body,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest request) {
        return ok(
                adminServiceCatalogService.updateCategory(id, body, actor(principal, request)),
                "Service category updated successfully!");
    }

    @PutMapping("/reorder")
    public ResponseEntity<ApiResource<List<AdminServiceCategoryResource>>> reorder(
            @Valid @RequestBody ReorderServiceCategoriesRequest body,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest request) {
        return ok(
                adminServiceCatalogService.reorderCategories(body, actor(principal, request)),
                "Service categories reordered successfully!");
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<ApiResource<AdminServiceCategoryResource>> activate(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest request) {
        return ok(
                adminServiceCatalogService.setCategoryActive(id, true, actor(principal, request)),
                "Service category enabled successfully!");
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<ApiResource<AdminServiceCategoryResource>> deactivate(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest request) {
        return ok(
                adminServiceCatalogService.setCategoryActive(id, false, actor(principal, request)),
                "Service category hidden successfully!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResource<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest request) {
        adminServiceCatalogService.deleteCategory(id, actor(principal, request));
        return ok(null, "Service category deleted successfully!");
    }
}
