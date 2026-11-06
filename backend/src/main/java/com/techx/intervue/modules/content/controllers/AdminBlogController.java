package com.techx.intervue.modules.content.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.content.enums.BlogPostStatus;
import com.techx.intervue.modules.content.requests.AdminSearchBlogRequest;
import com.techx.intervue.modules.content.requests.CreateBlogPostRequest;
import com.techx.intervue.modules.content.requests.UpdateBlogPostRequest;
import com.techx.intervue.modules.content.resources.AdminBlogSummaryResource;
import com.techx.intervue.modules.content.resources.BlogPostDetailResource;
import com.techx.intervue.modules.content.resources.BlogPostListResource;
import com.techx.intervue.modules.content.services.interfaces.AdminBlogServiceInterface;
import com.techx.intervue.modules.content.services.interfaces.AdminBlogServiceInterface.UploadedCoverResource;
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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/admin/blogs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBlogController extends BaseController {

    private final AdminBlogServiceInterface adminBlogService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResource<AdminBlogSummaryResource>> getSummary() {
        return ok(adminBlogService.getSummary(), "Blog summary metrics retrieved successfully!");
    }

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<BlogPostListResource>>> searchPosts(
            AdminSearchBlogRequest request, Pageable pageable) {
        return page(
                adminBlogService.searchPosts(request, pageable),
                "Admin blog posts retrieved successfully!");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResource<BlogPostDetailResource>> getPost(@PathVariable Long id) {
        return ok(adminBlogService.getPostById(id), "Blog post retrieved successfully!");
    }

    @PostMapping
    public ResponseEntity<ApiResource<BlogPostDetailResource>> createPost(
            @Valid @RequestBody CreateBlogPostRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest servletRequest) {
        return created(
                adminBlogService.createPost(request, actor(principal, servletRequest)),
                "Blog post created successfully!");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResource<BlogPostDetailResource>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBlogPostRequest request,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest servletRequest) {
        return ok(
                adminBlogService.updatePost(id, request, actor(principal, servletRequest)),
                "Blog post updated successfully!");
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResource<BlogPostDetailResource>> updateStatus(
            @PathVariable Long id,
            @RequestParam BlogPostStatus status,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest servletRequest) {
        return ok(
                adminBlogService.updateStatus(id, status, actor(principal, servletRequest)),
                "Blog post status updated successfully!");
    }

    @PatchMapping("/{id}/featured")
    public ResponseEntity<ApiResource<BlogPostDetailResource>> toggleFeatured(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest servletRequest) {
        return ok(
                adminBlogService.toggleFeatured(id, actor(principal, servletRequest)),
                "Blog post featured status toggled successfully!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResource<Void>> deletePost(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails principal,
            HttpServletRequest servletRequest) {
        adminBlogService.deletePost(id, actor(principal, servletRequest));
        return ok(null, "Blog post deleted successfully!");
    }

    @PostMapping("/cover-image")
    public ResponseEntity<ApiResource<UploadedCoverResource>> uploadCoverImage(
            @RequestParam("file") MultipartFile file) {
        return created(
                adminBlogService.uploadCoverImage(file), "Cover image uploaded successfully!");
    }
}
