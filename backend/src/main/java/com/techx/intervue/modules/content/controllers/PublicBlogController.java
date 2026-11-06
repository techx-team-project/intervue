package com.techx.intervue.modules.content.controllers;

import com.techx.intervue.controllers.BaseController;
import com.techx.intervue.modules.content.requests.SearchBlogPostRequest;
import com.techx.intervue.modules.content.resources.BlogCategoryResource;
import com.techx.intervue.modules.content.resources.BlogPostDetailResource;
import com.techx.intervue.modules.content.resources.BlogPostListResource;
import com.techx.intervue.modules.content.services.interfaces.BlogServiceInterface;
import com.techx.intervue.resources.ApiResource;
import com.techx.intervue.resources.PageResource;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/blogs")
@RequiredArgsConstructor
public class PublicBlogController extends BaseController {

    private final BlogServiceInterface blogService;

    @GetMapping("/categories")
    public ResponseEntity<ApiResource<List<BlogCategoryResource>>> listCategories() {
        return ok(blogService.listActiveCategories(), "Blog categories retrieved successfully!");
    }

    @GetMapping("/categories/{slug}")
    public ResponseEntity<ApiResource<BlogCategoryResource>> getCategory(
            @PathVariable String slug) {
        return ok(blogService.getCategoryBySlug(slug), "Blog category retrieved successfully!");
    }

    @GetMapping
    public ResponseEntity<ApiResource<PageResource<BlogPostListResource>>> searchPosts(
            SearchBlogPostRequest request, Pageable pageable) {
        return page(
                blogService.searchPosts(request, pageable), "Blog posts retrieved successfully!");
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResource<List<BlogPostListResource>>> getFeaturedPosts() {
        return ok(blogService.getFeaturedPosts(), "Featured blog posts retrieved successfully!");
    }

    @GetMapping("/{categorySlug}/{slug}")
    public ResponseEntity<ApiResource<BlogPostDetailResource>> getPost(
            @PathVariable String categorySlug, @PathVariable String slug) {
        return ok(
                blogService.getPostBySlug(categorySlug, slug), "Blog post retrieved successfully!");
    }

    @GetMapping("/{categorySlug}/{slug}/related")
    public ResponseEntity<ApiResource<List<BlogPostListResource>>> getRelatedPosts(
            @PathVariable String categorySlug,
            @PathVariable String slug,
            @RequestParam(defaultValue = "3") int limit) {
        return ok(
                blogService.getRelatedPosts(categorySlug, slug, limit),
                "Related blog posts retrieved successfully!");
    }
}
